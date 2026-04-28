/* global jsyaml */

$(function() {
  // 文章编辑页
  const id = $("#edtID").val();
  $(".divHeader2,.divHeader").append(
    `<small class="x-is-right ex2md"><a target="_blank" title="导出为 Markdown" href="${bloghost}zb_users/plugin/mz_MardkownExt/export.php?id=${id}">导出为 Markdown</a></small>`,
  );

  if ($(".edt-more").length == 0) {
    $("#cheader").append(
      "<a href='javascript:;' title=\"插入摘要分隔符\" onclick='fnEdtMore();' class=\"edt-more\">「摘要分隔」</a>",
    );
  }

  $("#cheader").append(
    "<a href='javascript:;' title=\"解析 YAML\" onclick='fnYAML2JSON();' class=\"edt-yaml\">「解析 YAML」</a>",
  );

  $("#cheader").append(
    "<a href='javascript:;' title=\"使用 YAML 填写\" onclick='fnYAML2JSON(1);' class=\"edt-yaml-fill hidden\">「使用 YAML 填写」</a>",
  );

  // 文章列表页
  $("tr").each(function() {
    const $_this = $(this);
    const id = $_this.find("td:first-child").text();
    const $title = $_this.find(".td10 + *:not(.td10)");
    const title = $title.text();
    $title.append(
      `<i class="icon-markdown"></i> <a target="_blank" title="${title}" href="${bloghost}zb_users/plugin/mz_MardkownExt/export.php?id=${id}">Markdown</a>`,
    );
    // console.log(id, $title.text());
  });
});

// eslint-disable-next-line no-unused-vars
function fnEdtMore() {
  let strMore = "";
  if (typeof window.EDITORMD == "object") {
    strMore = "xn<!--more-->xf";
  } else {
    strMore = "<hr class=\"more\" />";
  }
  editor_api.editor.content.insert(strMore);
  let oBody = editor_api.editor.content.get();
  oBody = oBody.replace(/[\r\n]*xn<!--more-->xf[\r\n]*/, "\n\n<!--more-->\n\n");
  editor_api.editor.content.put(oBody);
  editor_api.editor.intro.put("");
}

// eslint-disable-next-line no-unused-vars
function fnYAML2JSON(fill = null) {
  let err = 0,
    msg = "";
  // 获取正文内容
  let oBody = editor_api.editor.content.get();
  oBody = oBody.replace(/<!-- ---|--- -->/g, "---");
  // console.log(oBody);

  // 拆分为数组
  const arrBody = oBody.split("---");
  // console.log(arrBody);

  // YAML 文本
  const strYaml = arrBody[1];
  // console.log(strYaml);

  // 解析为 json,解析失败直接返回
  const doc = jsyaml.load(strYaml, "utf8");
  console.log(doc);
  if (!doc) {
    return { err, msg };
  }

  // 之后的内容
  let strCon = "";
  for (let i = 2; i < arrBody.length; i++) {
    const element = arrBody[i];
    strCon += "---" + element;
  }
  // 解析数据与文本框对比
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
      // console.log(typeof docVal);
      if (typeof docVal == "object") {
        docVal = docVal.join(",");
        // console.log(docVal);
      }
      if (docVal != inputVal) {
        $input.addClass("ui-button-warning");
        err = 1;
        msg = key;
        console.log(docVal);
        if (fill) {
          if (key !== "ID") {
            $input.val(docVal);
          } else {
            alert(`YAML 信息不匹配 ${msg}`);
          }
        }
      } else {
        $input.removeClass("ui-button-warning");
      }
    }
  }
  if (err) {
    $(".edt-yaml-fill").removeClass("hidden");
  } else {
    $(".edt-yaml-fill").addClass("hidden");
  }
  if (!arrBody[0]) {
    oBody = `<!-- ---${strYaml}--- -->${strCon}`;
    editor_api.editor.content.put(oBody);
  }
  if (strCon.indexOf("<!--more-->")) {
    const arrIntro = strCon.split("<!--more-->");
    editor_api.editor.intro.put(arrIntro[0].trim());
  }
  if (fill) {
    if ($("#edtDateTime").length === 1) {
      $("#edtDateTime").datetimepicker("setDate", new Date());
    }
    return fnYAML2JSON();
  }
  return { err, msg };
}
