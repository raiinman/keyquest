<?php
/**
 * Key Quest Recovery Harness — read-only Neopets image CDN proxy.
 *
 * Safety boundary:
 * - GET / HEAD only
 * - images.neopets.com only
 * - no cookies or authorization forwarded
 * - no account writes, prize redemption, NP/item transactions, or POST support
 */

declare(strict_types=1);

header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Access-Control-Allow-Origin: *');

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
if ($method !== 'GET' && $method !== 'HEAD') {
    http_response_code(405);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Read-only recovery harness: write methods are blocked.\n";
    exit;
}

$path = isset($_GET['path']) ? (string)$_GET['path'] : '';
$path = ltrim($path, '/');

if ($path === '' || strpos($path, '..') !== false || preg_match('/[\\\x00-\x1F\x7F]/', $path)) {
    http_response_code(400);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Invalid path.\n";
    exit;
}

// Preserve all query parameters except our local routing parameter.
$query = $_GET;
unset($query['path']);
$target = 'https://images.neopets.com/' . $path;
if (!empty($query)) {
    $target .= '?' . http_build_query($query, '', '&', PHP_QUERY_RFC3986);
}

$host = parse_url($target, PHP_URL_HOST);
if ($host !== 'images.neopets.com') {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Blocked origin.\n";
    exit;
}

$started = microtime(true);
$ch = curl_init($target);
if ($ch === false) {
    http_response_code(500);
    exit('Unable to initialize proxy.');
}

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 5,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_USERAGENT => 'KeyQuest-Recovery-Harness/0.1 (read-only archival compatibility test)',
    CURLOPT_HTTPHEADER => ['Accept: */*'],
    CURLOPT_HEADER => true,
    CURLOPT_NOBODY => $method === 'HEAD',
    CURLOPT_COOKIE => '',
]);

$response = curl_exec($ch);
if ($response === false) {
    $error = curl_error($ch);
    curl_close($ch);
    error_log(json_encode([
        'ts' => gmdate('c'),
        'kind' => 'fetch-error',
        'target' => $target,
        'error' => $error,
    ]));
    http_response_code(502);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Proxy fetch failed.\n";
    exit;
}

$status = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
$headerSize = (int)curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$contentType = (string)(curl_getinfo($ch, CURLINFO_CONTENT_TYPE) ?: 'application/octet-stream');
$body = substr($response, $headerSize);
$bytes = strlen($body);
curl_close($ch);

error_log(json_encode([
    'ts' => gmdate('c'),
    'kind' => 'fetch',
    'method' => $method,
    'target' => $target,
    'status' => $status,
    'contentType' => $contentType,
    'bytes' => $bytes,
    'ms' => (int)round((microtime(true) - $started) * 1000),
]));

http_response_code($status > 0 ? $status : 502);
header('Content-Type: ' . $contentType);

if ($method !== 'HEAD') {
    echo $body;
}
