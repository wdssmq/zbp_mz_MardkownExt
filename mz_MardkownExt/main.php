<?php
require '../../../zb_system/function/c_system_base.php';
$zbp->Load();
$action = 'root';
if (!$zbp->CheckRights($action)) {
  $zbp->ShowError(6);
  die();
}
if (!$zbp->CheckPlugin('mz_MardkownExt')) {
  $zbp->ShowError(48);
  die();
}
$zbp->BuildTemplate();

$id = GetVars("id", "GET");
$download = GetVars("download", "GET");

$article = $zbp->GetPostByID($id);
if (count($article->Tags) == 0) {
  $article->Tag = PostArticle_CheckTagAndConvertIDtoString("none");
}
if (empty($article->Alias)) {
  $article->Alias = $article->ID;
}
$key = $zbp->Config('mz_MardkownExt')->key;
$md_content = $article->Metas->md_content;
if (!empty($md_content)) {
  $article->Content = $md_content;
}
$zbp->template->SetTags('article', $article);
$rlt = $zbp->template->Output("plugin_mz_MardkownExt_tpl-post");
$rlt = str_replace("-|", "", $rlt);
if ($download !== null) {
  header('Content-Disposition: attachment; filename="doc-' . $article->Title . '.md"');
  echo $rlt;
  die();
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo $article->Title; ?></title>
  <p><a href="<?php echo $zbp->currenturl ?>&download">下载doc.md</a></p>
  <p>---------------------------</p>
  <pre>
<?php echo FormatString($rlt, "[html-format]"); ?>
  </pre>
</head>

<body>

</body>

</html>
