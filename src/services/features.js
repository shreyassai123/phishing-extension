/*global chrome*/
function getFeatures() {

var result = {};

var url = window.location.href;
var urlDomain = window.location.hostname;

var patt = /(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]?[0-9])(\.|$){4}/;
var patt2 = /(0x([0-9][0-9]|[A-F][A-F]|[A-F][0-9]|[0-9][A-F]))(\.|$){4}/;
var ip = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;


if(ip.test(urlDomain)||patt.test(urlDomain)||patt2.test(urlDomain)){ 
    result["IP Address"]="1";
}else{
    result["IP Address"]="-1";
}

if(url.length<54){
    result["URL Length"]="-1";
}else if(url.length>=54&&url.length<=75){
    result["URL Length"]="0";
}else{
    result["URL Length"]="1";
}

var onlyDomain = urlDomain.replace('www.','');

if(onlyDomain.length<7){
    result["Tiny URL"]="1";
}else{
    result["Tiny URL"]="-1";
}

patt=/@/;
if(patt.test(url)){ 
    result["@ Symbol"]="1";
}else{
    result["@ Symbol"]="-1";
}

if(url.lastIndexOf("//")>7){
    result["Redirecting using //"]="1";
}else{
    result["Redirecting using //"]="-1";
}

patt=/-/;
if(patt.test(urlDomain)){ 
    result["(-) Prefix/Suffix in domain"]="1";
}else{
    result["(-) Prefix/Suffix in domain"]="-1";
}

if((onlyDomain.match(RegExp('\\.','g'))||[]).length===1){ 
    result["No. of Sub Domains"]="-1";
}else if((onlyDomain.match(RegExp('\\.','g'))||[]).length===2){ 
    result["No. of Sub Domains"]="0";    
}else{
    result["No. of Sub Domains"]="1";
}

patt=/https:\/\//;
if(patt.test(url)){
    result["HTTPS"]="-1";
}else{
    result["HTTPS"]="1";
}

var favicon = undefined;
var nodeList = document.getElementsByTagName("link");
for (var i = 0; i < nodeList.length; i++)
{
    if((nodeList[i].getAttribute("rel") === "icon")||(nodeList[i].getAttribute("rel") === "shortcut icon"))
    {
        favicon = nodeList[i].getAttribute("href");
    }
}
if(!favicon) {
    result["Favicon"]="-1";
}else if(favicon.length===12){
    result["Favicon"]="-1";
}else{
    patt=RegExp(urlDomain,'g');
    if(patt.test(favicon)){
        result["Favicon"]="-1";
    }else{
        result["Favicon"]="1";
    }
}

result["Port"]="-1";
patt=/https/;
if(patt.test(onlyDomain)){
    result["HTTPS in URL's domain part"]="1";
}else{
    result["HTTPS in URL's domain part"]="-1";
}

var imgTags = document.getElementsByTagName("img");

var phishCount=0;
var legitCount=0;

patt=RegExp(onlyDomain,'g');

for(i = 0; i < imgTags.length; i++){
    var src = imgTags[i].getAttribute("src");
    if(!src) continue;
    if(patt.test(src)){
        legitCount++;
    }else if(src.charAt(0)==='/'&&src.charAt(1)!=='/'){
        legitCount++;
    }else{
        phishCount++;
    }
}
var totalCount=phishCount+legitCount;
var outRequest=(phishCount/totalCount)*100;

if(outRequest<22){
    result["Request URL"]="-1";
}else if(outRequest>=22&&outRequest<61){
    result["Request URL"]="0";
}else{
    result["Request URL"]="1";
}

var aTags = document.getElementsByTagName("a");

phishCount=0;
legitCount=0;

for(i = 0; i < aTags.length; i++){
    var hrefs = aTags[i].getAttribute("href");
    if(!hrefs) continue;
    if(patt.test(hrefs)){
        legitCount++;
    }else if(hrefs.charAt(0)==='#'||(hrefs.charAt(0)==='/'&&hrefs.charAt(1)!=='/')){
        legitCount++;
    }else{
        phishCount++;
    }
}
totalCount=phishCount+legitCount;
outRequest=(phishCount/totalCount)*100;

if(outRequest<31){
    result["Anchor"]="-1";
}else if(outRequest>=31&&outRequest<=67){
    result["Anchor"]="0";
}else{
    result["Anchor"]="1";
}

var sTags = document.getElementsByTagName("script");
var lTags = document.getElementsByTagName("link");

phishCount=0;
legitCount=0;

for(i = 0; i < sTags.length; i++){
    var sTag = sTags[i].getAttribute("src");
    if(sTag!=null){
        if(patt.test(sTag)){
            legitCount++;
        }else if(sTag.charAt(0)==='/'&&sTag.charAt(1)!=='/'){
            legitCount++;
        }else{
            phishCount++;
        }
    }
}

for(i = 0; i < lTags.length; i++){
    var lTag = lTags[i].getAttribute("href");
    if(!lTag) continue;
    if(patt.test(lTag)){
        legitCount++;
    }else if(lTag.charAt(0)==='/'&&lTag.charAt(1)!=='/'){
        legitCount++;
    }else{
        phishCount++;
    }
}

totalCount=phishCount+legitCount;
outRequest=(phishCount/totalCount)*100;

if(outRequest<17){
    result["Script & Link"]="-1";
}else if(outRequest>=17&&outRequest<=81){
    result["Script & Link"]="0";
}else{
    result["Script & Link"]="1";
}
var forms = document.getElementsByTagName("form");
var res = "-1";

for( i = 0; i < forms.length; i++) {
    var action = forms[i].getAttribute("action");
    if(!action || action === "") {
        res = "1";
        break;
    } else if(!(action.charAt(0)==="/" || patt.test(action))) {
        res = "0";
    }
}
result["SFH"] = res;

forms = document.getElementsByTagName("form");
res = "-1";

for(i = 0; i < forms.length; i++) {
    action = forms[i].getAttribute("action");
    if(!action) continue;
    if(action.startsWith("mailto")) {
        res = "1";
        break;
    }
}
result["mailto"] = res;

var iframes = document.getElementsByTagName("iframe");

if(iframes.length === 0) {
    result["iFrames"] = "-1";
} else {
    result["iFrames"] = "1";
}

chrome.runtime.sendMessage({type: "url", data: url});
chrome.runtime.sendMessage({type: "features", data: result});
console.log(result)

return result
}

module.exports = getFeatures;
