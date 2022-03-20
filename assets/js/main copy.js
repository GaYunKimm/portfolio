/**
 * resources.js.commonUtil.js
 * @fileOverview 공통유틸 스크립트
 * @version 0.1
 * @requires
 * @see
 * @copyright © 2013 s.com All right reserved
 */

/**
 * 팝업 윈도우 열기
 * Example  : popupWin(winUrl, 'RoleMenu', 600, 400, 'yes', 'no')
 * @param url 팝업창 URL
 * @param name 팝업창 이름
 * @param width 가로너비
 * @param height 세로너비
 * @param useScroll 스크롤 사용여부 (yes/no)
 * @param resize 창 사이즈 조절 여부 (yes/no)
 */
 function popupWin(url, name, width, height, useScroll, resize){
  var features;
  var t = screen.height / 2 - height / 2;
  var l = screen.width  / 2 - width  / 2;
  var option = "toolbar=no,menubar=no,location=no,scrollbars=" + useScroll + ",status=yes,resizable=" + resize;

  features = "top=" + t + ",left=" + l + ",width=" + width + ",height=" + height + "," + option;
  var remote = window.open(url, name, features);
  if (remote && remote.opener == null) remote.opener = window;
  if (remote) remote.focus();
  return remote;
}

/**
* 체크박스 전체 선택
* Example  : selectAll(document.forms[0], this, chkBoxList)
* @param frm form name
* @param chkBoxAll 체크박스 모두선택 Obj or Obj이름
* @param chkBoxList 채크박스목록 Object 이름
*/
function selectAll(frm, chkBoxAll, chkBoxList){
  chkBoxList = eval(chkBoxList);
  with(frm){
      if(chkBoxList != null ) {
          if(chkBoxAll.checked == true ) {
              if(chkBoxList.length == null) {
                  chkBoxList.checked = true;
              }
              else{
                  for(var i=0;i<chkBoxList.length;i++) {
                      chkBoxList[i].checked = true;
                  }
              }
          }
          else {
              if(chkBoxList.length == null) {
                  chkBoxList.checked = false;
              }
              else{
                  for(var i=0;i<chkBoxList.length;i++) {
                      chkBoxList[i].checked = false;
                  }
              }
          }
      }
      else {
          chkBoxAll.checked = false;
      }
  }
}

/**
* 체크박스 전체 선택
* Example  : selectAll(document.forms[0], this, chkBoxList)
* @param frm form name
* @param chkBoxAll 체크박스 모두선택 Obj or Obj이름
* @param chkBoxList 채크박스목록 Object 이름
* @returns Boolean
*/
function deleteChecked(frm, chkBoxListId, chkListObj){
  var chkValue = getCheckBoxCount(frm, chkBoxListId, chkListObj);

  if(chkValue >= 1){
      //var bFlag = window.confirm(strBar+strMsg + "정말 삭제하시겠습니까?\n"+strBar);
      var bFlag = window.confirm("정말 삭제하시겠습니까?");
      //var bFlag = window.confirm("Do you really Delete this Data?");
      if(bFlag){
          // frm.submit();
          return true;
      }
  } else {
      if(-1==chkValue){
          alert("입력된 항목이 없어서 삭제하실 수 없습니다.");
          //alert("Can't delete because of No selected data.");
      } else if(chkValue == 0) {
          alert("하나 이상의 항목을 선택하셔야 삭제하실 수 있습니다.");
          //alert("Can Delete after selecting one or more data.");
      }
      return false;
  }
}

/**
* 체크박스 체크갯수
* @param frm form name
* @param chkBoxListId 체크박스 ID
* @param chkListObj 채크박스 Object
* @returns Number
*/
function getCheckBoxCount(frm, chkBoxListId, chkListObj){
  var count = 0;      //CheckBox Count
  var cntChk = 0;     //Checked CheckBox Count

  for(var i = 0 ; i < frm.elements.length; i++){
      if(frm.elements[i].name == chkBoxListId){
          count++;
      }
  }
  if(count==0){
      return -1;
  } else if(count==1) {
      if(chkListObj.checked){
          cntChk = 1;
      } else {
          cntChk = 0;
      }
  } else {
      for(var i = 0; i < count; i++){
          //alert(frm.chkRecord(i).checked)
          if(chkListObj[i].checked){
              cntChk++;
          }
      }
  }
  return cntChk;
}

/**
* Form Submit을 위한 Function
* @param frm FormName
* @param e mappings.xml 에서 JSP forward name 에 정의된 이름
* @param j SessionBean 에서 구현하여 실행할 Method 의 명
* @param w Sub 구분값
* @returns {Object}
*/
function frmSubmit(frm, e, j, w){
  frm.cmd.value = e;
  frm.EXEC_MTD.value = j;
  if (frm.SUB){
      frm.SUB.value = w;
  }
  frm.submit();
}

/**
* Select에서 특정 Value를 Selected로 만들고 싶을때 사용..
* @param obj Selected를 true로 만들 SelectObject
* @param val value
*/
function selectSelectObj(obj, val){
  for(var i=0; i<obj.length; i++){
      if(val == obj[i].value){
          obj[i].selected = true;
      }
  }
}

/**
* 필수 속성, 사이즈를 체크한다.
* @param f Form Name
* @returns Boolean
*/
function checkRequiredForCommon(f){
  for(var intLoop = 0; intLoop < f.elements.length; intLoop++){

      //필수 속성 체크
      if(null != f.elements[intLoop].getAttribute("required")){
          if(isEmptyForCommon(f.elements[intLoop].value)){
              var msg = f.elements[intLoop].getAttribute("alt");
              msg += " 필수 속성입니다. 값을 입력해주세요.";
              //msg += " the Mandatory Attribute, Input the Value.";
              alert(msg);
              f.elements[intLoop].focus();
              return false;
          }
      }

      //숫자 체크
      if(null != f.elements[intLoop].getAttribute("isNumber")){
          if(!Numeric_Check(f.elements[intLoop].value)){
              var msg = f.elements[intLoop].getAttribute("alt");
              msg += " 숫자만 입력 가능합니다.";
              //msg += " must be  Input only as the  Number Type.";
              alert(msg);
              if (f.elements[intLoop].type == "select-one"){
                  f.elements[intLoop].focus();
              } else {
                  f.elements[intLoop].select();
              }
              return false;
          }
      }

      //영문 체크
      if(null != f.elements[intLoop].getAttribute("isEng")){
          if(!onlyEng(f.elements[intLoop].value)){
              var msg = f.elements[intLoop].getAttribute("alt");
              msg += " 영문만 입력 가능합니다.";
              //msg += " must be Input only if in English.";
              alert(msg);
              if (f.elements[intLoop].type == "select-one"){
                  f.elements[intLoop].focus();
              } else {
                  f.elements[intLoop].select();
              }
              return false;
          }
      }

      //영문 & 숫자 체크
      if(null != f.elements[intLoop].getAttribute("isEngNum")){
          if(!isAlphaNumeric(f.elements[intLoop].value)){
              var msg = f.elements[intLoop].getAttribute("alt");
              msg += " 영문만 입력 가능합니다.";
              //msg += " must be Input only if in Number Type and English.";
              alert(msg);
              if (f.elements[intLoop].type == "select-one"){
                  f.elements[intLoop].focus();
              } else {
                  f.elements[intLoop].select();
              }
              return false;
          }
      }

      //size 체크
      if(null != f.elements[intLoop].getAttribute("maxSize")) {
          if(!sizeValidateForCommon(f.elements[intLoop].value, f.elements[intLoop].getAttribute("maxSize"))){
              var msg = f.elements[intLoop].getAttribute("alt");
              msg += " " + f.elements[intLoop].getAttribute("maxSize") + " 글자 이하이어야 합니다.";
              //msg += "  Possible Input  only under the " + f.elements[intLoop].getAttribute("maxSize") + " charaters.";
              alert(msg);
              if (f.elements[intLoop].type == "select-one"){
                  f.elements[intLoop].focus();
              } else {
                  f.elements[intLoop].select();
              }
              return false;
          }
      }

      //IP 체크
      if(null != f.elements[intLoop].getAttribute("isIp")){
          if(!checkIpForm(f.elements[intLoop].value)){
              var msg = f.elements[intLoop].getAttribute("alt");
              msg += " " + f.elements[intLoop].getAttribute("maxSize") + " 글자 이하이어야 합니다.";
              //msg += "  must be  Input only as the  IP Format.";
              alert(msg);
              if (f.elements[intLoop].type == "select-one"){
                  f.elements[intLoop].focus();
              } else {
                  f.elements[intLoop].select();
              }
              return false;
          }
      }

      if(null != f.elements[intLoop].getAttribute("isTime")){
          if(!checkTimeForm(f.elements[intLoop].value)){
              var msg = f.elements[intLoop].getAttribute("alt");
              msg += " " + f.elements[intLoop].getAttribute("maxSize") + " 글자 이하이어야 합니다.";
              //msg += " must be  Input only as the Time Format.";
              alert(msg);
              if (f.elements[intLoop].type == "select-one"){
                  f.elements[intLoop].focus();
              } else {
                  f.elements[intLoop].select();
              }
              return false;
          }
      }

  }
  return true;
}

/**
* 필수 속성, 사이즈를 체크한다. (checkRequiredForCommon(f)에서 사용)
* @param str 체크할 문자열
* @returns Boolean
*/
function isEmptyForCommon(str){
  for(var intLoop = 0; intLoop < str.length; intLoop++){
      if(" " != str.charAt(intLoop)){
          return false;
      }
  }
  return true;
}

/**
* 사이즈를 체크한다.  (checkRequiredForCommon(f)에서 사용)
* @param str 체크할 문자열
* @param limit 최소 사이즈
* @returns Boolean
*/
function sizeValidateForCommon(str, limit){
  var size = 0;
  var i = 0;

  for (i = 0; i < str.length; i++){
      var code = str.charCodeAt(i);
      var ch   = str.substr(i,1).toUpperCase();
      code = parseInt(code);

      if ((ch<"0"||ch>"9") && (ch<"A"||ch>"Z") && ((code>255)||(code<0))) {
          size+=3;
      } else {
          size+=1;
      }

      if(size > limit) {
          return false;
      }
  }
  return true;
}

/**
* 넘어온 문자열들이 모두 숫자인가를 확인 true:모두숫자, false:문자포함
* @param strings 문자열
* @returns Boolean
*/
function numericCheck(strings) {
  var c;
  var i;

  for(i = 0; i < strings.length; i++) {
      c = strings.charAt(i);
      if(c < '0' || c > '9'){
         return false;
      }
  }
  return true;
}

/**
* 지정된 객체의 문자열의 길이를 계산하는 함수
* @param strings 문자열
* @returns Number
*/
function CheckByte(str){
 var i;
 var strLen;
 var strByte;
 strLen = str.length;

 if(IEYES == 1){  // IE4.0 이상
     for(i=0, strByte=0;i<strLen;i++){
         if(str.charAt(i) >= ' ' && str.charAt(i) <= '~' ){
             strByte++;
         } else {
             strByte += 2;
         }
     }
     return strByte;
 } else {         // Netscape일 경우
     return strLen;
 }
}

/**
* 공백(null) 입력 여부 check, true: 공백, false: 공백 아님
* @param nval 문자열
* @returns Boolean
*/
function isNull(nval) {
  for(var i = 0; i < nval.length; i++){
      var tst = nval.substring(i, i+1);
      if((tst != ' ')&&(tst != '\r')&&(tst != '\n')&&(tst != '\t')&&(tst != '\b')&&(tst != '\f')){
          return false;
      }
  }
  return true;
}

/**
* 기능 : 지정된 객체의 유효한 문자들의 길이를 계산하고 정해진 길이 초과시 경고 메시지를 출력하는 함수
* 한글, 영문 구분없이 무조건 길이만 계산함
* ex : "Korea"는 5글자, "대한민국"은 4글자, "대한민국(Korea)"는 11글자
* 사용예) CheckValid(document.form1.username, "사용자명", 30)
* 주의) formname에는 "document.form명.field명"까지만 입력한다.
* @param formname
* @param labelname
* @param labellength
* @returns Boolean
*/
function checkValid(formname, labelname, labellength){
  formname.value = formname.value.replace(/^\s+/,"");
  formname.value = formname.value.replace(/\s+$/,"");

  if(formname.value == ""){
      alert(labelname + " 입력하세요");
      //alert(" Please, Input the " +labelname + "  value.");
      formname.focus();
      return false;
  } else {
      if(formname.value.length > labellength) {
          alert(labelname + " " + labellength + "자를 초과할수 없습니다. 현재 " + formname.value.length + "자입니다.");
          //alert(labelname + "  Can't exceed the number of " + labellength + "Characters . Now  The Number of Characters " + formname.value.length + ".");
          formname.focus();
          return false;
      }
      return true;
  }
}

/**
* 특수문자 체크
* @param str
* @returns Boolean
*/
function checkEXP(str){
  //특수문자를 배열
  var filter_word = /[$\\@\\\#%\^\&\*\(\)\[\]\+\_\{\}\`\~\=\|]/;

  if (str.search(filter_word)>=0){
      alert("검색어에 특수문자를 포함할 수 없습니다.");
      //alert("Can't input the Specical Characters.");
      return false;
  }
  return true;
}

/**
*
* @param dateStrA
* @param dateStrB
* @returns Boolean
*/
function checkDateAfter(dateStrA, dateStrB){
  var dStrA = dateStrA,
      dStrB = dateStrB;

  if(dStrB == null) {
      dStrB = strNowDate();
  }

  while(dStrA.indexOf("-")>0) {
      dStrA = dStrA.replace("-", "");
  }
  while(dStrB.indexOf("-")>0) {
      dStrB = dStrB.replace("-", "");
  }

  var dateA = new Date(dStrA.substring(0, 4), parseFloat(dStrA.substring(4, 6))-1, dStrA.substring(6, 8));
  var dateB = new Date(dStrB.substring(0, 4), parseFloat(dStrB.substring(4, 6))-1, dStrB.substring(6, 8));

  if(dateA <= dateB) {
      return true;
  } else {
      return false;
  }
}

/**
*
* @param str
* @returns Boolean
*/
function checkKor(str){
  var i = 0;
  for (i = 0; i < str.length; i++){
      var code = str.charCodeAt(i);
      var ch   = str.substr(i,1).toUpperCase();
      code = parseInt(code);

      if ((ch<"0"||ch>"9") && (ch<"A"||ch>"Z") && ((code>255)||(code<0))){
          return false;
      }
  }
  return true;
}

/**
*
* @param str
* @returns Boolean
*/
function onlyEng(str){
  var deny_pattern = /[^A-Za-z]/g;

  if(str.search(deny_pattern) != -1){
      return false;
  } else {
      return true;
  }
}

/**
*
* @param str
* @returns Boolean
*/
function isAlphaNumeric(str) {
  var re = /[a-zA-Z0-9]/;
  for (var i = 0; i < str.length; i++) {
      if (!re.test(str.charAt(i))) {
          return false;
      }
  }
  return true;
}

/**
* 문자열 중 특정문자(문자열)를 새로운 문자(문자열)로 변경한다.
* @param as_string 변환할 문자열
* @param as_old 변경대상 문자열
* @param as_new 변경 문자열
* @returns String 변경된 문자열
*/
function convert(as_string, as_old, as_new) {
  var li_c_index = -1;            // 변경문자 시작위치
  var li_l_index = 0;             // 변경문자 종료위치
  var ls_result = "";             // 반환할 문자열
  var li_length = as_old.length;  // 변경대상문자길이

  //예전 문자열을 새로운 문자열로 변경
  while ((li_c_index = as_string.indexOf(as_old, li_l_index)) != -1 ) {
      // 이전종료위치~현위치 문자열 + 새로운 문자열?
      ls_result += as_string.substring(li_l_index, li_c_index) + as_new;

      //이전종료위치를 현재위치 + 변경대상문자길이로 변경
      li_l_index = li_c_index + li_length;
  }

  // 남은 문자열을 반환문자열에 붙인다
  if ( li_l_index <= as_string.length){
      ls_result += as_string.substring(li_l_index, as_string.length);
  }
  return ls_result;
}

/**
*
* @param mail_addr
* @returns Boolean
*/
function checkEmailForm(mail_addr){
  if(mail_addr.indexOf("@") < 0){
      return false;
  } else {
      if((mail_addr.indexOf(".kr") < 0) && (mail_addr.indexOf(".com") < 0 ) && (mail_addr.indexOf(".net") < 0 )){
          return false;
      } else {
          return true;
      }
  }
}

/**
*
* @param ip_addr
* @returns Boolean
*/
function checkIpForm(ip_addr){
  return ip_addr.match(/^([1]\d\d|[2][0-5][0-5]|[1-9][0-9]|[0-9]){1}(\.([1]\d\d|[2][0-5][0-5]|[1-9][0-9]|[0-9])){3}$/);
}

/**
*
* @param time
* @returns Boolean
*/
function checkTimeForm(time){
  return time.match(/^([0]\d|[1]\d|[2][0-4])\:([0-5]\d)$/);
}

/**
*
* @param tel_no
* @returns Boolean
*/
function checkTelNoForm(tel_no){
  var startIndex = 0,
      endIndex = 0,
      tempTelNo = "",
      firstDegit = "",
      secondDegit    = "",
      lastDegit = "";

  if(tel_no == "" ){
      return false;
  }

  endIndex = tel_no.indexOf("-");

  if(endIndex == -1){
      return false;
  }

  firstDegit = tel_no.substring(startIndex, endIndex);
  tempTelNo = tel_no.substring(endIndex + 1);

  if(firstDegit.length < 2  || firstDegit.length  > 3 ){
      return false;
  }

  startIndex = 0;
  endIndex = tempTelNo.indexOf("-");

  secondDegit = tempTelNo.substring(startIndex, endIndex);
  lastDegit = tempTelNo.substring(endIndex + 1);

  if(secondDegit.length < 3 || secondDegit.length > 4) {
      return false;
  }

  if(lastDegit.length != 4){
      return false;
  }

  return true;
}

/**
* 숫자 + (',' '-' '.')  입력되게 함
* example : onKeyPress="comOnlyNumber()"
* 주의) style="ime-mode:disabled"와 병용할 것
* @returns Boolean
*/
function comOnlyNumber(){
  if((event.keyCode < 48) || (event.keyCode > 57) || (event.keyCode == 229)){
      // ',','-','.'허용
      if(event.keyCode == 44 || event.keyCode == 45 || event.keyCode == 46 || event.keyCode == 109 || event.keyCode == 110){
          event.returnValue = true;
      } else {
          event.returnValue = false;
      }
  }
}

/**
* 숫자만 입력되게 함
* example : onKeyPress="comInputNumber()"
* 주의) style="ime-mode:disabled"와 병용할 것
* @returns Boolean
*/
function comInputNumber(){
  if((event.keyCode < 48) || (event.keyCode > 57)){
      event.returnValue = false;
  }
}

/**
* 숫자 + ('-') 입력되게 함
* example : onKeyPress="comOnlyNumberMinus()"
* 주의) style="ime-mode:disabled"와 병용할 것
* @returns Boolean
*/
function comOnlyNumberMinus(){
  if((event.keyCode < 48) || (event.keyCode > 57) || (event.keyCode == 229)){
      if(event.keyCode == 45 || event.keyCode == 109){    // '-' 허용
          event.returnValue = true;
      } else {
          event.returnValue = false;
      }
  }
}


/**
* 숫자만 입력되게 함
* example : onKeyDown="comInputNumberKeyDown()"
* @returns Boolean
*/
function inputNumberKeyDown(){

  var key = event.which || event.keyCode;

  if (!event.shiftKey && !event.altKey && !event.ctrlKey &&
      // numbers
      key >= 48 && key <= 57 ||
      // Numeric keypad
      key >= 96 && key <= 105 ||
      // Backspace and Tab and Enter
      key == 8 || key == 9 || key == 13 ||
      // Home and End
      key == 35 || key == 36 ||
      // left and right arrows
      key == 37 || key == 39 ||
      // Del and Ins
      key == 46 || key == 45) return true;

  return false;
}

/**
* 알파벳만 입력되게 함
* example : onKeyPress="comOnlyAlpha()"
* 주의) style="ime-mode:disabled"와 병용할 것
* @returns Boolean
*/
function comOnlyAlpha(){
  if(((event.keyCode >= 65) && (event.keyCode <= 90)) ||
          ((event.keyCode >= 97) && (event.keyCode <= 122)) ||
          (event.keyCode == 32) || (event.keyCode == 46)){
      null;
  } else {
      event.returnValue = false;
  }
}

/**
* 숫자 또는 알파벳만 입력되게 함.
* example : onKeyPress="comOnlyAlphaNumber()"
* 주의) style="ime-mode:disabled"와 병용할 것.
* @returns Boolean
*/
function comOnlyAlphaNumber(){
  if(((event.keyCode >= 48) && (event.keyCode<=57)) ||
          ((event.keyCode >= 65) && (event.keyCode <= 90)) ||
          ((event.keyCode >= 97) && (event.keyCode <= 122)) ||
          (event.keyCode == 32) || (event.keyCode == 46)){
      null;
  } else {
      event.returnValue = false;
  }
}

/**
*
* @returns Boolean
*/
function comOnlyEmailWord(){
  if(((event.keyCode >= 48) && (event.keyCode <= 57)) ||
          ((event.keyCode >= 65) && (event.keyCode <= 90)) ||
          ((event.keyCode >= 97) && (event.keyCode <= 122)) ||
          (event.keyCode == 32) || (event.keyCode == 46) ||
          (event.keyCode == 45) || (event.keyCode == 95) ||
          (event.keyCode == 39)){
      null;
  } else {
      event.returnValue = false;
  }
}

/**
* 한글만 입력되게 함
* example: onKeyPress="comOnlyHangul()"
* @returns Boolean
*/
function comOnlyHangul(){
  if((event.keyCode >= 12592) && (event.keyCode <= 12687)){
      null;
  } else {
      event.returnValue = false;
  }
}

/**
* 한글 또는 영문만 입력되게 함
* @returns Boolean
*/
function comOnlyHangulAlpha(){
  if(((event.keyCode > 12592) && (event.keyCode < 12687)) ||
          (((event.keyCode >= 65) && (event.keyCode <= 90)) ||
                  ((event.keyCode >= 97) && (event.keyCode <= 122)) ||
                  (event.keyCode == 32) || (event.keyCode == 46))){
      null;
  } else {
      event.returnValue = false;
  }
}

/**
* Y 또는 N 만 입력되게 함
* example: onKeyPress="comOnlyYN()"
* 주의) style="ime-mode:disabled"와 병용할 것.
* @returns Boolean
*/
function comOnlyYN(){
  if((event.keyCode == 78) || (event.keyCode == 89 ) || (event.keyCode == 110) || (event.keyCode == 121)){
      null;
  } else {
      event.returnValue = false;
  }
}

/**
* 문자열 Replace
* @param str
* @param bstr
* @param nextstr
* @returns String
*/
function comStrReplace(str, bstr, nextstr){
  var rtn = "";
  var whileflag = 1;
  var nextPos = 0;
  var startpos = 0;
  var leftstr = '';
  var rightstr = '';
  var startstr = bstr.substr(0, 1);
  var bstrlen = bstr.length;

  if(bstr.length==0){
      return str;
  }

  while(whileflag) {
      startpos=str.indexOf(startstr,nextPos);
      if (str.indexOf(startstr,nextPos) == -1) {
          return str;
      }

      if(str.substr(startpos,bstrlen) == bstr) {
          leftstr = str.substr(0, startpos);
          rightstr = str.substr(startpos+bstr.length);
          rtn = leftstr + nextstr + rightstr;
          str = rtn;
          nextPos = startpos + 1;
      } else {
          nextPos = startpos+1;
          if(nextPos > str.length) {
              whileflag = 0;
              rtn = str;
          }
      }
  }
  return rtn;
}

/**
* 문자 Replace
* @param str
* @param ch1
* @param ch2
* @returns String
*/
function comCharReplace(str, ch1, ch2){
  var ret = '',
      idx = 0;

  for (idx = 0; idx < str.length; idx++) {
      switch(str.charAt(idx)) {
          case ch1:
              ret += ch2;
              break;
          default:
              ret += str.charAt(ch2);
              break;
      }
  }

  return ret;
}

/**
* 문자열중간의 특수문자를 없애는 함수
* @param str
* @returns String
*/
function comRemoveSpecialChar(str) {
  var specialChar = " ~`!@#$%^&*()_-+=|\\:;\"'{}[]<>?,./";
  var rtn = "";
  var len = str.length;

  for(var idx = 0; idx < len;idx++) {
      if(specialChar.indexOf(str.charAt(idx)) == -1 ) {
          rtn += str.charAt(idx);
      }
  }
  return rtn;
}

/**
* 현재일자를 가져온다
* @returns String
*/
function comToDay() {
  var yy = "";
  var mon = "";
  var day = "";
  var currdate = new Date();

  tmpmon = currdate.getMonth();
  if(tmpmon < 9){
      mon = "0" + (tmpmon + 1);
  } else {
      mon = tmpmon + 1;
  }

  tmpday = currdate.getDate();
  if(tmpday < 10){
      day = "0" + tmpday;
  } else {
      day = tmpday;
  }

  return yy.toString() + mon.toString() + day.toString();
}

/**
* 입력상자에 년도를 입력할 경우 자동으로 token 또는 '-'를 붙여주는 함수
* example   : onKeyUp="javascript:comKeyUpDate(this)" -> '20011113'=>'2001-11-13'
* @param inObj 입력Object
* @returns Object
*/
function comKeyUpDate(inObj){
  var strVls = inObj.value;
  var buf  = "";
  var rtn  = "";
  var token = "-";

  strVls = comRemoveSpecialChar(strVls);

  if(strVls.length > 8) {
      return false;
  }

  var idx = 0;
  for(idx = 0; idx < strVls.length; idx++){
      buf = strVls.charAt(idx);
      if(idx == 4 || idx == 6 ) {
          rtn += token;
      }
      if(!comIsNumber(buf)) rtn += buf;
  }
  inObj.value = "";
  inObj.value = rtn;

  return rtn;
}

/**
* 입력상자에 전화번호,팩스번호,휴대폰번호를 입력할 경우 자동으로 token 또는 '-'를 붙여주는 함수
* example   : onKeyUp="javascript:comKeyUpPhone(this)" -> '20011113'=>'2001-11-13'
* @param inObj 입력Object
* @returns Object
*/
function comKeyUpPhone(inObj){
  var strVls = inObj.value;
  var buf  = "";
  var rtn  = "";
  var token = "-";

  strVls = comRemoveSpecialChar(strVls);

  if(strVls.length>11) {
      return false;
  }

  for(var idx = 0; idx < strVls.length; idx++){
      buf = strVls.charAt(idx);
      if(strVls.substring(0,2) == "02"){
          if(strVls.length > 8){
              if(idx == 2 || idx == 6 ) {
                  rtn += token;
              }
          } else {
              if(idx == 2 || idx == 5 ) {
                  rtn += token;
              }
          }
      } else {
          if(strVls.length > 9){
              if(idx == 3 || idx == 7 ) {
                  rtn += token;
              }
          } else {
              if(idx == 3 || idx == 6 ) {
                  rtn += token;
              }
          }
      }

      if(!comIsNumber(buf)) rtn += buf;
  }

  inObj.value = "";
  inObj.value = rtn;

  return rtn;
}

/**
* @param textVal
* @returns String
*/
function textToHtml(textVal){
  var strip = new RegExp();
  var retString = "";

  strip = /[&]/gi;
  retString = retString.replace(strip, "&amp;");
  strip = /[\r][\n][<][b][r][>]/gi;
  retString = textVal.replace(strip, "\r\n");
  strip = /[<][b][r][>][\r][\n]/gi;
  retString = retString.replace(strip, "\r\n");
  strip = /[<][b][r][>]/gi;
  retString = retString.replace(strip, "\r\n");
  strip = /[<]/gi;
  retString = retString.replace(strip, "&lt;");
  strip = /[>]/gi;
  retString = retString.replace(strip, "&gt;");
  strip = /[\r][\n]/gi;
  retString = retString.replace(strip, "<br>\r\n");
  strip = /["]/gi;
  retString = retString.replace(strip, '&quot;');
  strip = /[']/gi;
  retString = retString.replace(strip, '\'');
  strip = /[ ]/gi;
  retString = retString.replace(strip, "&nbsp;");

  return retString;
}

/**
* 입력한 글자수를 체크
* @param aro_name
* @param ari_max
*/
function fc_chk_byte(aro_name, ari_max){
 var ls_str = aro_name.value;     // 이벤트가 일어난 컨트롤의 value 값
 var li_str_len = ls_str.length;  // 전체길이

 // 변수초기화
 var li_max = ari_max;    // 제한할 글자수 크기
 var i = 0;               // for문에 사용
 var li_byte = 0;         // 한글일경우는 2 그밗에는 1을 더함
 var li_len = 0;          // substring하기 위해서 사용
 var ls_str2 = "";        // 글자수를 초과하면 제한할수 글자전까지만 보여준다.

 for(i=0; i< li_str_len; i++){

     if (ls_str.charCodeAt(i) > 128) {
         li_len += 2;
         li_byte = 2;
     } else {
         li_len++;
         li_byte = 1;
     }

    // 전체 크기가 li_max를 넘지않으면
    /*if(li_byte <= li_max){
       li_len = i + 1;
    }*/

    // 전체길이를 초과하면
    if(li_len > li_max){
        alert(li_max + " 글자를 초과 입력할수 없습니다. \n 초과된 내용은 자동으로 삭제 됩니다. ");
        ls_str2 = ls_str.substring(0, i);
        aro_name.value = ls_str2;
        li_len -= li_byte;
        break;
    }
 }

 // 전체길이를 초과하면
 /*if(li_byte > li_max){
    alert(li_max + " 글자를 초과 입력할수 없습니다. \n 초과된 내용은 자동으로 삭제 됩니다. ");
    ls_str2 = ls_str.substr(0, li_len);
    aro_name.value = ls_str2;
 }*/

 $("#li_len").text(li_len);
 aro_name.focus();
}


Date.prototype.format = function(f) {
  if (!this.valueOf()) return " ";
  var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  var d = this;
  return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
      switch ($1) {
          case "yyyy": return d.getFullYear();
          case "yy": return (d.getFullYear() % 1000).zf(2);
          case "MM": return (d.getMonth() + 1).zf(2);
          case "dd": return d.getDate().zf(2);
          case "E": return weekName[d.getDay()];
          case "HH": return d.getHours().zf(2);
          case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
          case "mm": return d.getMinutes().zf(2);
          case "ss": return d.getSeconds().zf(2);
          case "a/p": return d.getHours() < 12 ? "오전" : "오후";
          default: return $1;
      }
  });
};

/**
* 날짜 계산
* @function
* @param {Date} dt 날짜 객체
* @param {String} v 가감값+단위 [3M | -10d | ...]
* @returns {Date} 계산된 날짜 객체
* @description
*  단위 [y:년 | M:월 | d:일 | w:주 | h:시 | m:분 | s:초]
*/
function calcDate(dt, v) {
  var d = new Date(dt),
      m = v.match(/([\-+]?\d*)(.*)/),
      n = parseInt(m[1], 10) || 0,
      u = m[2];

  if (n) {
      switch (u) {
      case 'y': d.setFullYear(dt.getFullYear() + n); break;
      case 'M': d.setMonth(dt.getMonth() + n); break;
      case 'd': d.setDate(dt.getDate() + n); break;
      case 'w': d.setDate(dt.getDate() + (n * 7)); break;
      case 'h': d.setHours(dt.getHours() + n); break;
      case 'm': d.setMinutes(dt.getMinutes() + n); break;
      case 's': d.setSeconds(dt.getSeconds() + n); break;
      default : d.setDate(dt.getDate() + n); break;
      }
  }

  return d;
}

/**
* 날짜 추가
* @function
* @param {Date} dt 날짜 객체
* @param {String} v 가감값+단위 [3M | -10d | ...]
* @description
*  단위 [y:년 | M:월 | d:일 | w:주 | h:시 | m:분 | s:초]
*/
function addDate(dt, v) {
  dt.setTime(calcDate(dt, v).getTime());
}

/**
* 날짜 비교
* @function
* @param {Date} dt1 비교 날짜1
* @param {Date} dt2 비교 날짜2
* @param {String} [u] 비교 단위
* @returns {Number} 비교 값 또는 두 날짜 간 차이
* @description
*  단위 [y:년 | M:월 | d:일 | h:시 | m:분 | s:초]
*/
function diffDate(dt1, dt2, u) {
  var g = dt1.getTimezoneOffset() * 60 * 1000,
      a, b, t;

  switch (u) {
  case 'y': return dt1.getFullYear() - dt2.getFullYear();
  case 'M': return ((dt1.getFullYear() - dt2.getFullYear()) * 12) + (dt1.getMonth() - dt2.getMonth());
  case 'd': t = 1000 * 60 * 60 * 24; break;
  case 'h': t = 1000 * 60 * 60; break;
  case 'm': t = 1000 * 60; break;
  case 's': t = 1000; break;
  default : return (dt1.getTime() === dt2.getTime() ? 0 : (dt1 > dt2 ? 1 : -1));
  }

  a = (Math.floor((dt1.getTime() - g) / t) * t) + g;
  b = (Math.floor((dt2.getTime() - g) / t) * t) + g;
  return (a - b) / t;
}

/**
* 숫자 포멧
* @param {Number} n 숫자
* @returns {String} ,로 구분된 숫자
*/
function formatNumber(n) {
  return n.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

/**
* crewmate04 회원가입 관련 작업시 추가함
* 모든 공백제거(양끝, 중간)
*/
function eraseSpace(val) {
  return val.replace(/\s+/g, '');
}

/**
* crewmate04 회원가입 관련 작업시 추가함
* 공백여부
*/
function isEmpty(val) {
  if (val == null || eraseSpace(val) == '') { return true; }
  return false;
}

// get parameter 얻어오기
$.extend({
    getUrlVars: function(){
      var vars = {}, hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++)
      {
        hash = hashes[i].split('=');
        vars[hash[0]] = hash[1];
      }
      return vars;
    },
    getUrlVar: function(name){
      return $.getUrlVars()[name];
    }
  });

//HashChange용 파라미터 얻어오기
$.extend({
    getHashVars: function(){
      var vars = {}, hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('#') + 1).split('&');
      for(var i = 0; i < hashes.length; i++)
      {
        hash = hashes[i].split('=');
        vars[hash[0]] = hash[1];
      }
      return vars;
    },
    getHashVar: function(name){
      return $.getUrlVars()[name];
    }
  });
/**
* crewmate04 회원가입 관련 작업시 추가함
* 이메일도메인 셀렉트 박스 값변경시(onchange) 이벤트
*      sb : 이메일도메인 셀렉트 박스객체
*/
function emailDomNmChange(sb) {
  var $_sb = $(sb);
  if (isEmpty($_sb.val())) { $_sb.prev().focus().attr("readonly", false).val(''); }
  else { $_sb.prev().attr("readonly", true).val($_sb.find(':selected').text()); }
}

/**
* crewmate04 회원가입 관련 작업시 추가함
* 회원 > 년 월 일 셀박 관련
* initApply   --> targetWrap(디폴트='.dateSBWrap') 밑에 select.yearSB, select.monthSB, select.daySB를 위치시키고 옵션태그는 비워둔다
*      페이지 로딩과 함께 실행시켜주면 셀박 옵션태그를 자동으로 랜더링해준다
* afterApply  --> 페이지 로딩시에는 셀박 옵션태그를 자동으로 랜더링하지 않지만, 년, 월셀박 조작시 이벤트를 바인드 시켜준다
*      이때 targetId문자열을 파라미터로 넘겨주면 특정 대상영역에만 적용된다.
* yearCnt     --> 현재년도부터 얼마나 차감될 것인지
* lastDayArr  --> 각 달에 해당하는 마지막 날짜 (Static)
* fnDayChange --> 년, 월셀박 조작시 이벤트 관련 함수
*      년, 월셀박 조작시 윤달조건에 따른 일셀박 옵션태그 동적변환
*/
var DateSB = {
      lastDayArr : [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      , fnDayChange : function ($_dateSBWrap, callBack) {
          if (isEmpty($_dateSBWrap.find('select.yearSB option:selected').val())
                  || isEmpty($_dateSBWrap.find('select.monthSB option:selected').val())) {
              return false;
          }

          var year = parseInt($_dateSBWrap.find('select.yearSB option:selected').text());
          var lastDay = DateSB.lastDayArr[parseInt($_dateSBWrap.find('select.monthSB option:selected').text()) - 1];
          if (lastDay == 29 && (!(year % 4 == 0 && year % 100 != 0) || (year % 400 == 0))) { // 윤달함수계산수식
              --lastDay;
          }

          // 개인정보 수정요청 시 기념일, 생일의 년, 월 선택시 기존 날짜(일)가 선택되고
          // 기존 날짜(일)가 선택된 월의 마지막일 보다 클 경우 선택된 달의 마지막 날짜(일)가 선택되게 수정
          var day = $_dateSBWrap.find('select.daySB option:selected').text();
          if(day == "선택") {
              day = 0;
          } else {
              day = (day > lastDay ? lastDay : day);
          }

          var optionArr = ['<option value="">선택</option>'];
          for ( var i = 0; i < lastDay; i++) {
              optionArr.push('<option value="' + padLeft(i + 1, 2) + '">' + (i + 1) + '</option>');
          }
          $_dateSBWrap.find('select.daySB').html(optionArr.join(''));

          // 개인정보 수정요청 시 기념일, 생일의 년, 월 선택시 기존 날짜(일)가 선택되고
          // 기존 날짜(일)가 선택된 월의 마지막일 보다 클 경우 선택된 달의 마지막 날짜(일)가 선택되게 수정
          if(DateSB.deviceType == "mobile" && padLeft(day, 2) == "00") {
              $_dateSBWrap.find('select.daySB').parent().siblings('.cc_ellip_in').text("선택");
          } if(DateSB.deviceType == "mobile" && padLeft(day, 2) != "00") {
              $_dateSBWrap.find('select.daySB').parent().siblings('.cc_ellip_in').text(day);
          }
          $_dateSBWrap.find('select.daySB').val(padLeft(day, 2));

          if(callBack) {
              callBack();
          }
      }
      , yearCnt : 100
      , targetWrap : '.dateSBWrap'
      , deviceType : 'pc'
      , initApply : function (callBack) {
          var now = new Date();

          $('select.yearSB').each(function () {
              var curYear = now.getFullYear();
              if ($(this).parents('.dateSBWrap').hasClass('brtdy')) { // 14시 미만을 위한 처리, 생년월일 dateSBWrap 에만 brtdy 를 추가해주면 됨
                  curYear = curYear -14;
              }
              if ($(this).parents('.dateSBWrap').hasClass('momkd')) { // 14시 미만을 위한 처리, 생년월일 dateSBWrap 에만 brtdy 를 추가해주면 됨
                  curYear = curYear + 1;
              }
              var optionArr = ['<option value="">선택</option>'];
              for (var i = 0; i < DateSB.yearCnt; i++) {
                  optionArr.push('<option value="' + (curYear - i) + '">' + (curYear - i) + '</option>');
              }
              $(this).html(optionArr.join(''));
          });
          $('select.monthSB').each(function () {
              var optionArr = ['<option value="">선택</option>'];
              for (var i = 1; i <= 12; i++) {
                  optionArr.push('<option value="' + padLeft(i, 2) + '">' + i + '</option>');
              }
              $(this).html(optionArr.join(''));
          });
          $('select.daySB').each(function () {
              var optionArr = ['<option value="">선택</option>'];
              for (var i = 1; i <= 31; i++) {
                  optionArr.push('<option value="' + padLeft(i, 2) + '">' + i + '</option>');
              }
              $(this).html(optionArr.join(''));
          });
          $(DateSB.targetWrap).find('select.yearSB, select.monthSB').change(function () {
              DateSB.fnDayChange($(this).parents(DateSB.targetWrap), callBack);
          });
      }
      , afterApply : function (targetId) {
          var selecter = (!isEmpty(targetId)) ? '#' + targetId : DateSB.targetWrap;
          $(selecter).find('select.yearSB, select.monthSB').change(function () {
              DateSB.fnDayChange($(this).parents(selecter));
          });
      }
};

/**
* 숫자만 반환
* example   : fnReturnOnlyNum('abc1DEF2ㄱㄴㄷ가나다!@#') -> '12'
* @param s 문자열
* @returns String
*/
function fnReturnOnlyNum(s) {
  return s.replace(/[^0-9]/gi,'');
}

/**
* 영문만 반환
* example   : fnReturnOnlyAlphabet('abc1DEF2ㄱㄴㄷ가나다!@#') -> 'abcDEF'
* @param s 문자열
* @returns String
*/
function fnReturnOnlyAlphabet(s) {
  return s.replace(/[^a-zA-Z]/gi,'');
}

/**
* 특수문자만 지우고 반환
* example   : fnReturnNotSpecialChar('abc1DEF2ㄱㄴㄷ가나다!@#') -> 'abc1DEF2ㄱㄴㄷ가나다'
* @param s 문자열
* @returns String
*/
function fnReturnNotSpecialChar(s) {
  //return s.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, '');
  return s.replace(/[^(가-힝ㄱ-ㅎㅏ-ㅣa-zA-Z0-9)]/gi, '');
}

/**
* 한글만 지우고 반환
* example   : fnReturnNotHangul('abc1DEF2ㄱㄴㄷ가나다!@#') -> 'abc1DEF2!@#'
* @param s 문자열
* @returns String
*/
function fnReturnNotHangul(s) {
  return s.replace(/[^a-zA-Z0-9]/gi,'');
}

/**
* 한글만 반환
* example   : fnReturnOnlyHangul('abc1DEF2ㄱㄴㄷ가나다!@#') -> 'ㄱㄴㄷ가나다'
* @param s 문자열
* @returns String
*/
function fnReturnOnlyHangul(s) {
  return fnReturnNotSpecialChar(s).replace(/[a-zA-Z0-9]/gi,'');
}

/**
* 문자체크를 위한 함수
* Example  : containsChars(str, '~!@#$%^&*()_)++')
* @param str 비교할 문자열, chars 조건 문자열
* @returns 유효시-false, 비유효시-true
*/
function containsChars(str, chars) {
  for (var i = 0; i < str.length; i++) {
      if (chars.indexOf(str.charAt(i)) != -1) { return true; }
  }
  return false;
}


/**
* 말줄임 + '...'
* Example  : cutString('가나다라마123abc', 12)
* @param str 줄일 문자열
* @param maxByte 최대바이트 (한글 = 2, 그외 = 1 로 계산, 기본값 20)
* @returns 결과문자열 + '...'
*/
function cutString(str, maxByte) {
  if (maxByte == null || maxByte == undefined) { maxByte = 20; }
  var cnt = 0;
  for (var i = 0; i < str.length; i++) {
      cnt += (str.charAt(i).isKor()? 2 : 1);
      if (cnt >= maxByte) {
          return str.substring(0,i) + '...';
      }
  }
  return str;
}

/******************************************************************************
*  String prototype
******************************************************************************/

  /******************************************************************************
   * 문자의 좌, 우 공백 제거
   * @return : String
   ******************************************************************************/
  String.prototype.trim = function() {
      return this.replace(/(^\s*)|(\s*$)/g, "");
  };

  /******************************************************************************
   * 문자의 좌 공백 제거
   * @return : String
   ******************************************************************************/
  String.prototype.ltrim = function() {
      return this.replace(/(^\s*)/, "");
  };

  /******************************************************************************
   * 문자의 우 공백 제거
   * @return : String
   ******************************************************************************/
  String.prototype.rtrim = function() {
      return this.replace(/(\s*$)/, "");
  };

  /******************************************************************************
   * 문자열의 byte 길이 반환
   * @return : int
   ******************************************************************************/
  String.prototype.byte = function() {
      var cnt = 0;
      for (var i = 0; i < this.length; i++) {
          if (this.charCodeAt(i) > 127)
              cnt += 2;
          else
              cnt++;
      }
      return cnt;
  };

  /******************************************************************************
   * 정수형으로 변환
   * @return : String
   ******************************************************************************/
  String.prototype.int = function() {
      if(!isNaN(this)) {
          return parseInt(this);
      }
      else {
          return null;
      }
  };

  /******************************************************************************
   * 숫자만 가져 오기
   * @return : String
   ******************************************************************************/
  String.prototype.num = function() {
      return (this.trim().replace(/[^0-9]/g, ""));
  };

  /******************************************************************************
   * 숫자에 3자리마다 , 를 찍어서 반환
   * @return : String
   ******************************************************************************/
  String.prototype.money = function() {
      var num = this.trim();
      while((/(-?[0-9]+)([0-9]{3})/).test(num)) {
          num = num.replace((/(-?[0-9]+)([0-9]{3})/), "$1,$2");
      }
      return num;
  };

  /******************************************************************************
   * 숫자의 자리수(cnt)에 맞도록 반환
   * @return : String
   ******************************************************************************/
  String.prototype.digits = function(cnt) {
      var digit = "";
      if (this.length < cnt) {
          for(var i = 0; i < cnt - this.length; i++) {
              digit += "0";
          }
      }
      return digit + this;
  };

  /******************************************************************************
   * " -> &#34; ' -> &#39;로 바꾸어서 반환
   * @return : String
   ******************************************************************************/
  String.prototype.quota = function() {
      return this.replace(/"/g, "&#34;").replace(/'/g, "&#39;");
  };

  /******************************************************************************
   * 파일 확장자만 가져오기
   * @return : String
   ******************************************************************************/
  String.prototype.ext = function() {
      return (this.indexOf(".") < 0) ? "" : this.substring(this.lastIndexOf(".") + 1, this.length);
  };

  /******************************************************************************
   * URL에서 파라메터 제거한 순수한 url 얻기
   * @return : String
   ******************************************************************************/
  String.prototype.uri = function() {
      var arr = this.split("?");
      arr = arr[0].split("#");
      return arr[0];
  };


/******************************************************************************
* 각종 체크 함수들
******************************************************************************/
/******************************************************************************
* 정규식에 쓰이는 특수문자를 찾아서 이스케이프 한다.
* @return : String
******************************************************************************/
String.prototype.meta = function() {
  var str = this;
  var result = "";
  for(var i = 0; i < str.length; i++) {
      if((/([\$\(\)\*\+\.\[\]\?\\\^\{\}\|]{1})/).test(str.charAt(i))) {
          result += str.charAt(i).replace((/([\$\(\)\*\+\.\[\]\?\\\^\{\}\|]{1})/), "\\$1");
      } else {
          result += str.charAt(i);
      }
  }
  return result;
};

/******************************************************************************
* 정규식에 쓰이는 특수문자를 찾아서 이스케이프 한다.
* @return : String
******************************************************************************/
String.prototype.remove = function(pattern) {
  return (pattern == null) ? this : eval("this.replace(/[" + pattern.meta() + "]/g, \"\")");
};

/******************************************************************************
* 최소 최대 길이인지 검증
* str.isLength(min [,max])
* @return : boolean
******************************************************************************/
String.prototype.isLength = function() {
  var min = arguments[0];
  var max = arguments[1] ? arguments[1] : null;
  var success = true;
  if(this.length < min) {
      success = false;
  }
  if(max && this.length > max) {
      success = false;
  }
  return success;
};

/******************************************************************************
* 최소 최대 바이트인지 검증
* str.isByteLength(min [,max])
* @return : boolean
******************************************************************************/
String.prototype.isByteLength = function() {
  var min = arguments[0];
  var max = arguments[1] ? arguments[1] : null;
  var success = true;
  if(this.byte() < min) {
      success = false;
  }
  if(max && this.byte() > max) {
      success = false;
  }
  return success;
};

/******************************************************************************
* 공백이나 널인지 확인
* @return : boolean
******************************************************************************/
String.prototype.isBlank = function() {
  var str = this.trim();
  for(var i = 0; i < str.length; i++) {
      if ((str.charAt(i) != "\t") && (str.charAt(i) != "\n") && (str.charAt(i)!="\r")) {
          return false;
      }
  }
  return true;
};

/******************************************************************************
* 숫자로 구성되어 있는지 학인
* arguments[0] : 허용할 문자셋
* @return : boolean
******************************************************************************/
String.prototype.isNum = function() {
  return (/^[0-9]+$/).test(this.remove(arguments[0])) ? true : false;
};

/******************************************************************************
* 영어만 허용 - arguments[0] : 추가 허용할 문자들
* @return : boolean
******************************************************************************/
String.prototype.isEng = function() {
  return (/^[a-zA-Z]+$/).test(this.remove(arguments[0])) ? true : false;
};

/******************************************************************************
* 숫자와 영어만 허용 - arguments[0] : 추가 허용할 문자들
* @return : boolean
******************************************************************************/
String.prototype.isEngNum = function() {
  return (/^[0-9a-zA-Z]+$/).test(this.remove(arguments[0])) ? true : false;
};

/******************************************************************************
* 숫자와 영어만 허용 - arguments[0] : 추가 허용할 문자들
* @return : boolean
******************************************************************************/
String.prototype.isNumEng = function() {
  return this.isEngNum(arguments[0]);
};

/******************************************************************************
* 아이디 체크 4자 이상, 12자 이하, 영문 대/소문자, 숫자 조합
* @return : boolean
******************************************************************************/
String.prototype.isLoginId = function() {
  // 1. 4자 이상, 12자 이하
  if (this.match(/^.{4,12}$/g) == null) {
      return false;
  }
  // 2. 영문 대/소문자, 숫자 조합
  var valid_count = 0;
  if (this.match(/[a-zA-Z]/) != null) { valid_count++; }
  if (this.match(/[0-9]/) != null) { valid_count++; }
  if(valid_count < 2) {
      return false;
  }
  return true;
};

/******************************************************************************
* 비밀번호 체크 4자 이상, 12자 이하, 영문 대/소문자, 숫자 조합
* @return : boolean
******************************************************************************/
String.prototype.isPwd = function() {
  var pwdStr = this;
  // 1. 6자 이상, 20자 이하
  if (pwdStr.match(/^.{6,20}$/g) == null) {
      return false;
  }
  // 2. 영문 대/소문자, 숫자 조합
  var valid_count = 0;
  if (pwdStr.match(/[a-zA-Z]/) != null) { valid_count++; }
  if (pwdStr.match(/[0-9]/) != null) { valid_count++; }
  if(valid_count < 2) {
      return false;
  }
  var strights = ['012345678901', '987654321098', 'abcdefghijklmnopqrstuvwxyzab', 'zyxwvutsrqponmlkjihgfedcbazy'];
  for (var i = 0 ; i < pwdStr.length ; i++) {
      if (pwdStr.charAt(i+1) != '' && pwdStr.charAt(i+2) != '') {
          //3. 동일문자 3회이상 반복 불가
          if (pwdStr.charCodeAt(i) == pwdStr.charCodeAt(i+1) && pwdStr.charCodeAt(i+1) == pwdStr.charCodeAt(i+2)) {
              return false;
          }

          //4. 연속된 숫자/문자 3자 이상 사용불가
          var str3 = pwdStr.charAt(i) + '' + pwdStr.charAt(i+1) + '' + pwdStr.charAt(i+2);
          var pattern = new RegExp(str3.meta());
          for (var j = 0 ; j < strights.length ; j++) {
              if (pattern.exec(strights[j]) != null) {
                  return false;
              }
          }
      }
  }
  return true;
};

/******************************************************************************
* 한글 체크 - arguments[0] : 추가 허용할 문자들
* @return : boolean
******************************************************************************/
String.prototype.isKor = function() {
  return (/^[가-힝]+$/).test(this.remove(arguments[0])) ? true : false;
};

/******************************************************************************
* 외국인 등록번호 체크 - arguments[0] : 등록번호 구분자
* XXXXXX-XXXXXXX
* @return : boolean
******************************************************************************/
String.prototype.isForeign = function() {
  var arg = arguments[0] ? arguments[0] : "";
  var jumin = eval("this.match(/[0-9]{2}[01]{1}[0-9]{1}[0123]{1}[0-9]{1}" + arg + "[5678]{1}[0-9]{1}[02468]{1}[0-9]{2}[6789]{1}[0-9]{1}$/)");
  if(jumin == null) {
      return false;
  }
  else {
      jumin = jumin.toString().num().toString();
  }
  // 생년월일 체크
  var birthYY = (parseInt(jumin.charAt(6)) == (5 || 6)) ? "19" : "20";
  birthYY += jumin.substr(0, 2);
  var birthMM = jumin.substr(2, 2) - 1;
  var birthDD = jumin.substr(4, 2);
  var birthDay = new Date(birthYY, birthMM, birthDD);
  if(birthDay.getYear() % 100 != jumin.substr(0,2) || birthDay.getMonth() != birthMM || birthDay.getDate() != birthDD) {
      return false;
  }
  if((parseInt(jumin.charAt(7)) * 10 + parseInt(jumin.charAt(8))) % 2 != 0) {
      return false;
  }
  var sum = 0;
  var num = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
  var last = parseInt(jumin.charAt(12));
  for(var i = 0; i < 12; i++) {
      sum += parseInt(jumin.charAt(i)) * num[i];
  }
  return (((11 - sum % 11) % 10) + 2 == last) ? true : false;
};

/******************************************************************************
* 사업자번호 체크 - arguments[0] : 등록번호 구분자
* XXX-XX-XXXXX
* @return : boolean
******************************************************************************/
String.prototype.isBiznum = function() {
  var arg = arguments[0] ? arguments[0] : "";
  var biznum = eval("this.match(/[0-9]{3}" + arg + "[0-9]{2}" + arg + "[0-9]{5}$/)");
  if(biznum == null) {
      return false;
  }
  else {
      biznum = biznum.toString().num().toString();
  }
  var sum = parseInt(biznum.charAt(0));
  var num = [0, 3, 7, 1, 3, 7, 1, 3];
  for(var i = 1; i < 8; i++) sum += (parseInt(biznum.charAt(i)) * num[i]) % 10;
  sum += Math.floor(parseInt(parseInt(biznum.charAt(8))) * 5 / 10);
  sum += (parseInt(biznum.charAt(8)) * 5) % 10 + parseInt(biznum.charAt(9));
  return (sum % 10 == 0) ? true : false;
};

/******************************************************************************
* 법인 등록번호 체크 - arguments[0] : 등록번호 구분자
* XXXXXX-XXXXXXX
* @return : boolean
******************************************************************************/
String.prototype.isCorpnum = function() {
  var arg = arguments[0] ? arguments[0] : "";
  var corpnum = eval("this.match(/[0-9]{6}" + arg + "[0-9]{7}$/)");
  if(corpnum == null) {
      return false;
  }
  else {
      corpnum = corpnum.toString().num().toString();
  }
  var sum = 0;
  var num = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
  var last = parseInt(corpnum.charAt(12));
  for(var i = 0; i < 12; i++) {
      sum += parseInt(corpnum.charAt(i)) * num[i];
  }
  return ((10 - sum % 10) % 10 == last) ? true : false;
};

/******************************************************************************
* 이메일의 유효성을 체크
* @return : boolean
******************************************************************************/
String.prototype.isEmail = function() {
  return (/^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~.]*[0-9A-Za-z]+(\.?[-!#$%&'*+/0-9=?A-Z^_a-z{|}~.])*@[a-zA-Z0-9](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/).test(this.trim());
};

/******************************************************************************
* 전화번호 체크 - arguments[0] : 전화번호 구분자
* @return : boolean
******************************************************************************/
String.prototype.isPhone = function() {
  var arg = arguments[0] ? arguments[0] : "";
  return eval("(/(02|0505|0[3-9]{1}[0-9]{1})" + arg + "[1-9]{1}[0-9]{2,3}" + arg + "[0-9]{4}$/).test(this)");
};

/******************************************************************************
* 핸드폰번호 체크 - arguments[0] : 핸드폰 구분자
* @return : boolean
******************************************************************************/
String.prototype.isMobile = function() {
  var arg = arguments[0] ? arguments[0] : "";
  return eval("(/01[016789]" + arg + "[1-9]{1}[0-9]{2,3}" + arg + "[0-9]{4}$/).test(this)");
};

// 상품 이미지 경로 반환
function getItemImgPath(itemId, size, idx){
  var realIdx = typeof(idx) == "number" ? idx : 1;

  var cdn = ssg.cdn.item;
  var src = [];
  src.push(cdn);
  src.push("/");
  src.push(itemId.substring(11, 13));
  src.push("/");
  src.push(itemId.substring(9, 11));
  src.push("/");
  src.push(itemId.substring(7, 9));
  src.push("/item/");
  src.push(itemId);
  src.push("_i");
  src.push(realIdx);
  src.push("_");
  src.push(size);
  src.push(".jpg");

  return src.join("");
}

// 상품 NO 이미지 경로 반환
function getItemNoImgPath(size) {
return ssg.trans + '?w='+size+'&h='+size+'&src='+ssg.noImg[500];
}

/**
* 폼의 모든 엘리먼트의 좌우 공백 제거
* @param {String} form 폼 아이디 또는 셀렉터
* @returns {Element} 폼 객체
*/
function trimForm(form) {
  var f = $(document.getElementById(form) || form)[0],
      e, i;

  for (i = 0; e = f.elements[i]; i += 1) {
      if (/input|textarea/i.test(e.tagName) === true && /file|checkbox|radio|password/i.test(e.type) === false) {
          e.value = e.value.replace(/^\s*|\s*$/g, '');
      }
  }

  return f;
}

/**
* 레이어 팝업 중앙 정렬
* @function
* @param {Mixed} layerSelector 레이어 셀렉터
*/
function setLayerCenter(layerSelector) {
  var $w = $(window),
      $l = $(layerSelector),
      pt = (($w.height() - $l.height()) / 2) + $w.scrollTop(),
      ml = ($l.width() / -2);

  $l.css({ top: pt, left: '50%', marginLeft: ml });
}

/**
* 쿠폰 발급::일반
* @param {String} offerId 오퍼ID
* @param {String} offerDtlSeq 오퍼상세순번
* @param {Function} callback 콜백함수
* @returns
*/
function issueCoupon(offerId, offerDtlSeq, callback) {
  issueCouponWithQty(offerId, offerDtlSeq, 1, callback);
}

/**
* 쿠폰 발급::일반(수량)
* @param {String} offerId 오퍼ID
* @param {String} offerDtlSeq 오퍼상세순번
* @param {Number} wantedCpnQty 요청수량
* @param {Function} callback 콜백함수
* @returns
*/
function issueCouponWithQty(offerId, offerDtlSeq, wantedCpnQty, callback) {
  if (UserInfo.isLoginYn === 'N') {
      if (isMobile) {
          mobileLogin();
      } else {
          login();
      }
      return;
  }
  if (issueCouponWithQty.progress) {
      return;
  }

  issueCouponWithQty.progress = true;
  $.ajax({
      url: '/event/issueCoupon.ssg',
      type: 'POST',
      data: {
          offerId: offerId,
          offerDtlSeq: offerDtlSeq,
          wantedCpnQty: wantedCpnQty
      },
      dataType: 'json',
      success: function(json) {
          issueCouponWithQty.progress = false;
          if(json.errorCode == 'AJAX_LOGIN_FAIL' || json.errorMsg == 'AjaxLoginRequired login required') {
              alert("로그인 후 이용이 가능 합니다.");
              return;
          }
          json.resultMsg = json.resultMsg.replace(/\\n/g, '\n');

          alert(json.resultMsg);
          callback && callback(json);
      },
      error: function(result) {
          alert($.parseJSON(result.responseText).errorMsg);
          location.reload();
      }
  });
}

/**
* 쿠폰 발급::회원등급
* @function
* @param {Function} callback 콜백함수
*/
function issueCouponForGrade(callback) {
  if (UserInfo.isLoginYn === 'N') {
      if (isMobile) {
          mobileLogin();
      } else {
          login();
      }
      return;
  }
  if (issueCouponForGrade.progress) {
      return;
  }

  issueCouponForGrade.progress = true;

  var protocol = window.location.protocol.indexOf("https:") > -1 ? 'https://' : 'http://';
  var eventDomain = 'event.ssg.com';
  if(window.location.hostname.indexOf('local-') > -1) {
      eventDomain = 'dev-event.ssg.com';

  } else if(window.location.hostname.indexOf('dev-') > -1) {
      eventDomain = 'dev-event.ssg.com';

  } else if(window.location.hostname.indexOf('qa-') > -1) {
      eventDomain = 'qa-event.ssg.com';

  } else if (window.location.hostname.indexOf('stg-') > -1){
      eventDomain = 'stg-event.ssg.com';
  }

  var isMobile = window.location.hostname.indexOf('m.') > -1 ? 'Y' : 'N';
  var eventUrl = protocol + eventDomain + '/event/comm/issueCouponForGrade.ssg?isMobile=' + isMobile;

  $.ajax({
      url: eventUrl,
      type: 'GET',
      dataType: 'jsonp',
      success: function(json) {
          issueCouponForGrade.progress = false;
          if(json.errorCode == 'AJAX_LOGIN_FAIL' || json.errorMsg == 'AjaxLoginRequired login required') {
              alert("로그인 후 이용이 가능 합니다.");
              return;
          }
          json.resultMsg = json.resultMsg.replace(/\\n/g, '\n');

          if (callback) {
              callback(json);
          } else {
              alert(json.resultMsg.replace(/\\n/g, '\n'));
          }
      },
      error: function(json) {
          alert($.parseJSON(json.responseText).errorMsg);
          location.reload();
      }
  });
}

/**
* 쿠폰 발급::생일
* @function
* @param {Function} callback 콜백함수
*/
function issueCouponForBirth(callback) {
  if (UserInfo.isLoginYn === 'N') {
      if (isMobile) {
          mobileLogin();
      } else {
          login();
      }
      return;
  }
  if (issueCouponForBirth.progress) {
      return;
  }

  issueCouponForBirth.progress = true;
  $.ajax({
      url: '/event/issueCouponForBirth.ssg',
      type: 'POST',
      dataType: 'json',
      success: function(json) {
          issueCouponForBirth.progress = false;
          if(json.errorCode == 'AJAX_LOGIN_FAIL' || json.errorMsg == 'AjaxLoginRequired login required') {
              alert("로그인 후 이용이 가능 합니다.");
              return;
          }
          json.resultMsg = json.resultMsg.replace(/\\n/g, '\n');

          if (callback) {
              callback(json);
          } else {
              alert(json.resultMsg);
          }
      },
      error: function(result) {
          alert($.parseJSON(result.responseText).errorMsg);
          location.reload();
      }
  });
}

var fn_base64 = {
  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  decode : function (input, key) {
      if(isEmpty(input) || isEmpty(key)) {
          return "";
      }
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      while (i < input.length) {

          enc1 = this._keyStr.indexOf(input.charAt(i++));
          enc2 = this._keyStr.indexOf(input.charAt(i++));
          enc3 = this._keyStr.indexOf(input.charAt(i++));
          enc4 = this._keyStr.indexOf(input.charAt(i++));

          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;

          output = output + String.fromCharCode(chr1);

          if (enc3 != 64) {
              output = output + String.fromCharCode(chr2);
          }
          if (enc4 != 64) {
              output = output + String.fromCharCode(chr3);
          }

      }

      output = fn_base64._utf8_decode(output);

      if(isEmpty(output)) {
          return "";
      }

      if(output.indexOf(key) == -1) {
          return "";
      }

      var result = "";
      var cookieStrs = output.split('&');
      for(var i=0; i<cookieStrs.length; i++){
          if(cookieStrs[i].indexOf(key) >= 0){
              var values = cookieStrs[i].split('=');
              result = values[1];
              break;
          }
      }

      return result;

  },

  _utf8_decode : function (utftext) {
      var string = "";
      var i = 0;
      var c = c1 = c2 = 0;

      while ( i < utftext.length ) {

          c = utftext.charCodeAt(i);

          if (c < 128) {
              string += String.fromCharCode(c);
              i++;
          }
          else if((c > 191) && (c < 224)) {
              c2 = utftext.charCodeAt(i+1);
              string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
              i += 2;
          }
          else {
              c2 = utftext.charCodeAt(i+1);
              c3 = utftext.charCodeAt(i+2);
              string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
              i += 3;
          }

      }

      return string;
  }

};

function fixedEncodeURIComponent(str){
  return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");
}

function mobilAppPushReceiveYn(receiveYn, mobilAppSvcNo){

  if(!receiveYn || ( (receiveYn = receiveYn.toUpperCase()) != "Y" && receiveYn != "N" )){
      alert("잘못된 호출입니다.");
      return false;
  }

  if(!!mobile.customUrl.scheme){
      location = mobile.customUrl.scheme + "://status/push/" + receiveYn;
      if(receiveYn == "Y"){
          alert("모바일 앱 푸쉬 수신에 동의하셨습니다.");
      }else{
          alert("모바일 앱 푸쉬 수신을 거부하셨습니다.");
      }
  }else{
      if(confirm("모바일 앱의 푸쉬 설정 기능입니다.\n앱으로 바로 가시겠습니까?")){
          var command = 'page_open/self?url=' + fixedEncodeURIComponent(location.href) + '&title=' + fixedEncodeURIComponent($("title").html());
          appCommandExecute(command, mobilAppSvcNo);
      }
  }
  return true;
}

//mobilAppSvcNo
//1 이마트몰
//2 신세계몰 B2C
//3 SSG
//4 엠칼
//5 신세계몰 중문
//6 신세계몰 SFC

function getMobilAppSvcNo(){
var mobilAppSvcNoBySiteUrl ={
  'emart.ssg.com/' : '1',
  'shinsegaemall.ssg.com/' : '2',
  'm.ssg.com/' : '3',
  'sfcmall.' : '6'
};

  var mobilAppSvcNo = '3';

  for(var siteUrl in mobilAppSvcNoBySiteUrl){
    if(~location.href.indexOf(siteUrl)){
      mobilAppSvcNo = mobilAppSvcNoBySiteUrl[siteUrl];
      break;
    }
  }

  return mobilAppSvcNo;
}

function appCommandExecute(command, mobilAppSvcNo){
  appInfo(mobilAppSvcNo).done(function(json){
      appExecute(json, command);
  });
}

function appInfo(mobilAppSvcNo){
  return $.getJSON('/comm/app/appInfo.ssg', {mobilAppSvcNo: mobilAppSvcNo || getMobilAppSvcNo()});
}

function appExecute(json, command){

  var mobilAppExecuteMethod = {
  'Chrome' : function(json, command){
    var appCommand = 'Intent://execute' + (!!command ? '/' + command : '') + '#Intent;scheme=' + json.appLinkUrl + ';package=' + json.mobilAppPkgNm + ';end';
          location.href = appCommand;
  },
  'Android' : function(json, command){
    var ca = +new Date;
    $("#appExecuteCheckFrame").remove();

          setTimeout(function() {
              if (+new Date - ca < 1500) {
                  try  {
                      var b = document.appExecuteCheckFrame.document.body;
                      if (b.innerHTML.length == 0) {
                          document.appExecuteCheckFrame.location.href = json.aplVerLinkUrl1;
                      }
                  } catch (e) {
                      document.appExecuteCheckFrame.location.href = json.aplVerLinkUrl1;
                  }
              }
          }, 1000) ;

          var appCommand =  json.appLinkUrl + '://execute' + (!!command ? '/' + command : '');
          $("body").append("<iframe border='0' width='0' height='0' src='"+appCommand+"' name='appExecuteCheckFrame' id='appExecuteCheckFrame' title='앱구동프레임'/>");
  },
  'iPhone' : function(json, command){
    var ca = +new Date;
    setTimeout(function(){
              if (+new Date - ca < 1500) {
                  location.href = json.aplVerLinkUrl1;
              }
          }, 1000) ;

          document.location.href = json.appLinkUrl + '://execute' + (!!command ? '/' + command : '');
  },
  'iPad' : function(json, command){mobilAppExecuteMethod.iPhone(json, command)},
  'iPod' : function(json, command){mobilAppExecuteMethod.iPhone(json, command)}
};

  for(var i in mobilAppExecuteMethod){
    if(~navigator.userAgent.indexOf(i)){
      mobilAppExecuteMethod[i](json, command);
      break;
    }
  }
}

//1차 도메인 리턴
function get1depthDomain(){
  var host = $(location).attr('host');
  var tArray = host.split(".");
  return tArray[tArray.length-2]+"."+tArray[tArray.length-1];
}
