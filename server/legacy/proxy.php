<?php

function curl_get_content($url,$range_start,$range_end)
{
  $ch = curl_init();

  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt ($ch, CURLOPT_HTTPHEADER, array ("Range: bytes=$range_start-$range_end"));
  curl_setopt($ch, CURLOPT_BINARYTRANSFER, 1);
  $data = curl_exec($ch);
  curl_close($ch);

  return $data;
}

function smartReadFile($location, $filename, $size, $mimeType='application/octet-stream')
{
  $begin=0;
  $end=$size;


 if(isset($_SERVER['HTTP_RANGE'])){
    $range = preg_match('/^bytes=((\d*-\d*,? ?)+)$/', @$_SERVER['HTTP_RANGE'], $matches) ? $matches[1] : array();
    $rangeExploded = explode('-', $range);

    $begin = $rangeExploded[0];
    $end = $rangeExploded[1];
 }
  if($begin>0||$end<$size)
    header('HTTP/1.0 206 Partial Content');
  else
    header('HTTP/1.0 200 OK');

  header("Content-Type: $mimeType");
  header('Cache-Control: public, must-revalidate, max-age=0');
  header('Pragma: no-cache');
  header('Accept-Ranges: bytes');
  header('Content-Length:'.($end-$begin));
  header("Content-Range: bytes $begin-$end/$size");
  header("Content-Transfer-Encoding: binary\n");
  header('Connection: close');

  echo curl_get_content($location, $begin, $end);
}

function parseHeaders(array $headers, $header = null)
{
    $output = array();

    if ('HTTP' === substr($headers[0], 0, 4)) {
        list(, $output['status'], $output['status_text']) = explode(' ', $headers[0]);
        unset($headers[0]);
    }

    foreach ($headers as $v) {
        $h = preg_split('/:\s*/', $v);
        $output[strtolower($h[0])] = $h[1];
    }

    if (null !== $header) {
        if (isset($output[strtolower($header)])) {
            return $output[strtolower($header)];
        }

        return;
    }

    return $output;
}


if($_SERVER['REQUEST_METHOD'] != 'HEAD'){
    $externalHeaders = get_headers( $_GET['url'] );
    smartReadFile($_GET['url'],"file.flac", parseHeaders($externalHeaders, 'Content-Length'), "audio/flac");
}else{
    $externalHeaders = get_headers( $_GET['url'] );
    foreach ($externalHeaders as $header){
      header($header);
    }
}


?>