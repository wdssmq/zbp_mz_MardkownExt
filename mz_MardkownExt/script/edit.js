$(function () {
  // 文章编辑页
  const id = $("#edtID").val();
  $(".divHeader2").append(
    `<small class="x-is-right ex2md"><a target="_blank" title="导出为 Markdown" href="${bloghost}zb_users/plugin/mz_MardkownExt/export.php?id=${id}">导出为 Markdown</a></small>`
  );

  if ($(".edt-more").length == 0) {
    $("#cheader").append(
      "<a href='javascript:;' title=\"插入摘要分隔符\" onclick='fnEdtMore();' class=\"edt-more\"> [摘要分隔]</a>"
    );
  }

  $("#cheader").append(
    "<a href='javascript:;' title=\"解析YAML\" onclick='fnYAML2JSON();' class=\"edt-yaml\"> [解析YAML]</a>"
  );

  $("#btnPost").mouseenter(function () {
    const { err, msg } = fnYAML2JSON();
    if (err) {
      alert(`YAML 信息不匹配 ${msg}`);
    }
    return false;
  });

  function fnMove() {
    $("#edtTitle").unwrap();
    $("#alias").appendTo("#response5");
    $("#tags,#ulTag").appendTo("#response5");
  }
  fnMove();

  // 文章列表页
  $("tr").each(function () {
    const $_this = $(this);
    const id = $_this.find("td:first-child").text();
    const $title = $_this.find(".td10 + *:not(.td10)");
    const title = $title.text();
    $title.append(
      `<i class="icon-markdown"></i> <a target="_blank" title="${title}" href="${bloghost}zb_users/plugin/mz_MardkownExt/export.php?id=${id}">Markdown</a>`
    );
    // console.log(id, $title.text());
  });
});

function fnEdtMore() {
  let strMore = "";
  if (typeof window.EDITORMD == "object") {
    strMore = "xn<!--more-->xf";
  } else {
    strMore = '<hr class="more" />';
  }
  editor_api.editor.content.insert(strMore);
  let oBody = editor_api.editor.content.get();
  oBody = oBody.replace(/[\r\n]*xn<!--more-->xf[\r\n]*/, "\n\n<!--more-->\n\n");
  editor_api.editor.content.put(oBody);
  editor_api.editor.intro.put("");
}

function fnYAML2JSON() {
  let err = 0,
    msg = "";
  let oBody = editor_api.editor.content.get();
  oBody = oBody.replace(/<!-- ---|--- -->/g, "---");
  // console.log(oBody);
  const arrYaml = oBody.split("---");
  // console.log(arrYaml);
  const strYaml = arrYaml[1];
  // console.log(strYaml);
  let strCon = "";
  for (let i = 2; i < arrYaml.length; i++) {
    const element = arrYaml[i];
    strCon += element;
  }
  const doc = jsyaml.load(strYaml, "utf8");
  console.log(doc);
  if (!doc) {
    return { err, msg };
  }
  // categories
  const map = { Title: "title", Tag: "tags", Alias: "alias", ID: "id" };
  for (const key in map) {
    if (Object.hasOwnProperty.call(map, key)) {
      const docKey = map[key];
      if (!Object.hasOwnProperty.call(doc, docKey)) {
        continue;
      }
      let docVal = doc[docKey];
      const $input = $(`#edt${key}`);
      const inputVal = $input.val();
      // console.log(docVal,inputVal);
      if (typeof el == "array") {
        docVal = el.join(",");
      }
      if (docVal != $input.val()) {
        $input.addClass("ui-button-warning");
        err = 1;
        msg = key;
      } else {
        $input.removeClass("ui-button-warning");
      }
    }
  }
  if (!arrYaml[0]) {
    oBody = `<!-- ---${strYaml}--- -->${strCon}`;
    editor_api.editor.content.put(oBody);
  }
  if (strCon.indexOf("<!--more-->")) {
    const arrIntro = strCon.split("<!--more-->");
    editor_api.editor.intro.put(arrIntro[0].trim());
  }
  return { err, msg };
}
