<?php
#注册插件
RegisterPlugin("mz_MardkownExt", "ActivePlugin_mz_MardkownExt");

function ActivePlugin_mz_MardkownExt()
{
  Add_Filter_Plugin('Filter_Plugin_Zbp_BuildTemplate', 'mz_MardkownExt_GenTpl');
  // Add_Filter_Plugin('Filter_Plugin_Edit_End', 'mz_MardkownExt_Admin_JS');
  Add_Filter_Plugin('Filter_Plugin_Admin_Header', 'mz_MardkownExt_Admin_Insert');
}
function mz_MardkownExt_Admin_Insert()
{
  $act = GetVars("act", "GET");
  if ($act == "ArticleEdt") {
    echo '<link rel="stylesheet" href="' . mz_MardkownExt_Path("css-edit", "host") . '">';
    echo '<script src="' . mz_MardkownExt_Path("js-yaml", "host") . '"></script>';
  }
  if (HasNameInString("ArticleMng|ArticleEdt", $act)) {
    echo '<script src="' . mz_MardkownExt_Path("js-edit", "host") . '"></script>';
  }
}
function mz_MardkownExt_GenTpl(&$templates)
{
  $tplCont = file_get_contents(mz_MardkownExt_Path("tpl-post"));
  $templates["plugin_mz_MardkownExt_tpl-post"] = $tplCont;
}
function mz_MardkownExt_Path($file, $t = 'path')
{
  global $zbp;
  $result = $zbp->$t . 'zb_users/plugin/mz_MardkownExt/';
  switch ($file) {
    case 'js-yaml':
      return $result . 'script/js-yaml.min.js';
      break;
    case 'js-edit':
      return $result . 'script/edit.js';
      break;
    case 'css-edit':
      return $result . 'css/edit.css';
      break;
    case 'tpl-post':
      return $result . 'tpl/post.php';
      break;
    case 'usr':
      return $result . 'usr/';
      break;
    case 'var':
      return $result . 'var/';
      break;
    case 'main':
      return $result . 'main.php';
      break;
    default:
      return $result . $file;
  }
}
function InstallPlugin_mz_MardkownExt()
{
  global $zbp;
  if (!$zbp->HasConfig('mz_MardkownExt')) {
    $zbp->Config('mz_MardkownExt')->version = 1;
    $zbp->Config('mz_MardkownExt')->hooksAllowed = "mz_ShortSth";
    $zbp->SaveConfig('mz_MardkownExt');
  }
}
function UninstallPlugin_mz_MardkownExt()
{
}
