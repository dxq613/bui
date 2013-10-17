<?php
error_reporting(0);
//得到目录下的文件总数
function get_file_count($dir_name){
	$files = 0;
	if ($handle = opendir($dir_name)) {
	while (false !== ($file = readdir($handle))) {
		$files++;
	}
	closedir($handle);
	}
	return $files;
}
//循环删除目录和文件
function delDirAndFile($dirName){
	if ($handle = opendir($dirName) ) {
	   while ( false !== ( $item = readdir($handle) ) ){
		  if ( $item != "." && $item != ".." ) {
		  	unlink("$dirName/$item");
		  }

	   }
	   closedir($handle);

	}
}
$files = array();
$url = 'http://'.$_SERVER['SERVER_NAME'].':'.$_SERVER['SERVER_PORT'].rtrim(dirname($_SERVER['PHP_SELF']), '/\\')."/";
// echo $url;
// print_r($_SERVER);

// print_r ($_FILES);
function uploadFile($file_label){
	// global $url;
	$this_file = $_FILES[$file_label];

}
$fileInput = 'Filedata';
$dir = './files/';
$type = $_POST['type'];
// @mkdir($dir);

$isExceedSize = false;
/*-----------------*/
//以下三行代码用于删除文件，实际应用时请予以删除，get_file_count()和delDirAndFile（）函数都可以删掉
$dirName =  'files';
$size = get_file_count($dirName);
if($size > 3) delDirAndFile($dirName);
/*-----------------*/
$files_name_arr = array($fileInput);
foreach($files_name_arr as $k=>$v){
	$pic = $_FILES[$v];
  $isExceedSize = $pic['size'] > 500000;
  if(!$isExceedSize){
    if(file_exists($dir.$pic['name'])){
      @unlink($dir.$pic['name']);
    }
    // 解决中文文件名乱码问题
    $pic['name'] = iconv('UTF-8', 'GBK', $pic['name']);
    $result = move_uploaded_file($pic['tmp_name'], $dir.$pic['name']);
    $files[$k] = $url.$dir.$pic['name'];
	}
}
if(!$isExceedSize && $result){
    $arr = array(
        'status' => 1,
        'type' => $type,
        'name' => $_FILES[$fileInput]['name'],
        'url' => $dir.$_FILES[$fileInput]['name']
    );
}else if($isExceedSize){
    $arr = array(
        'status' => 0,
        'type' => $type,
        'msg' => "文件大小超过500kb！"
    );
}else{
    $arr = array(
        'status' => 0,
        'type' => $type,
        'msg' => "未知错误！".$result
    );
}

echo json_encode($arr);

?>

<?php
  // $fileInput = 'Filedata';
  // if ($_FILES[$fileInput]["error"] > 0)
  //   {
  //   echo "Return Code: " . $_FILES[$fileInput]["error"] . "<br />";
  //   }
  // else
  //   {
  //   echo "Upload: " . $_FILES[$fileInput]["name"] . "<br />";
  //   echo "Type: " . $_FILES[$fileInput]["type"] . "<br />";
  //   echo "Size: " . ($_FILES[$fileInput]["size"] / 1024) . " Kb<br />";
  //   echo "Temp file: " . $_FILES[$fileInput]["tmp_name"] . "<br />";

  //   if (file_exists("files/" . $_FILES[$fileInput]["name"]))
  //     {
  //     echo $_FILES[$fileInput]["name"] . " already exists. ";
  //     }
  //   else
  //     {
  //     move_uploaded_file($_FILES[$fileInput]["tmp_name"],
  //     "files/" . $_FILES[$fileInput]["name"]);
  //     echo "Stored in: " . "files/" . $_FILES[$fileInput]["name"];
  //     }
  //   }
?>