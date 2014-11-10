<%@page pageEncoding="UTF-8" %>
<%@include file="/jsp/init.jsp" %>

<%--@elvariable id="mindmap" type="com.wisemapping.model.Mindmap"--%>
<%--@elvariable id="editorTryMode" type="java.lang.Boolean"--%>
<%--@elvariable id="editorTryMode" type="java.lang.String"--%>

<!DOCTYPE HTML>

<html>
<head>
    <base href="${requestScope['site.baseurl']}/">
    <title>Framindmap - ${mindmap.title} </title>

    <!--[if lt IE 9]>
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <![endif]-->

    <link rel="stylesheet/less" type="text/css" href="css/embedded.less"/>

    <style type="text/css" media="print">
        @page {
            size: A4 landscape;
        }

        body {
            overflow: visible
        }

        #embFooter {
            display: none;
        }

        #footerLogo {
            display: block;
        }

        div#printLogo {
            width: 114px;
            height: 56px;
            position: absolute;
            display: list-item;
            list-style-image: url(../images/logo-xsmall.png);
            list-style-position: inside;
            right: 10px;
            bottom: -30px;
        }

    </style>

    <script type='text/javascript' src='js/mootools-core.js'></script>
    <script type='text/javascript' src='js/mootools-more.js'></script>
    <script type='text/javascript' src='js/core.js'></script>
    <script type='text/javascript' src='js/less.js'></script>


    <link rel="icon" href="images/favicon.ico" type="image/x-icon">
    <link rel="shortcut icon" href="images/favicon.ico" type="image/x-icon">

    <script type="text/javascript">
        var mapId = '${mindmap.id}';

        $(document).addEvent('loadcomplete', function (resource) {

            // Configure designer options ...
            var options = loadDesignerOptions();
            options.locale = '${locale}';
            options.size.height = options.size.height + 50;

            var userOptions = ${mindmap.properties};
            options.zoom = userOptions.zoom;

            // Set map id ...
            options.mapId = mapId;

            // Print is read only ...
            options.readOnly = true;

            // Configure loader ...
            options.persistenceManager = new mindplot.LocalStorageManager("c/restful/maps/{id}/document/xml${principal!=null?'':'-pub'}",true);

            // Build designer ...
            var designer = buildDesigner(options);

            // Load map ...
            var persistence = mindplot.PersistenceManager.getInstance();
            var mindmap = mindmap = persistence.load(mapId);
            designer.loadMap(mindmap);

            $('zoomIn').addEvent('click', function () {
                designer.zoomIn();
            });

            $('zoomOut').addEvent('click', function () {
                designer.zoomOut();
            });
        });
    </script>
</head>
<body>

<div id="mapContainer">
    <div id="mindplot"></div>
    <div id="printLogo"></div>

    <div id="embFooter">
        <a href="${requestScope['site.homepage']}" target="new" style="font-family: &quot;DejaVu Sans&quot;,&quot;Verdana&quot;,&quot;Geneva&quot;,&quot;sans serif&quot;;font-weight: bold; font-size:30px; text-decoration:none;float:right">
            <span style="color: #6A5687;">Fra</span><span style="color: #9BAE5F;">mindmap</span>
        </a>

        <div id="zoomOut" class="button"></div>
        <div id="zoomIn" class="button"></div>

        <div id="mapDetails">
            <span class="title"><spring:message code="CREATOR"/>:</span><span><c:out value="${mindmap.creator.fullName}"/></span>
            <span class="title"><spring:message code="DESCRIPTION"/>:</span><span><c:out value="${mindmap.title}"/></span>
        </div>
    </div>
</div>
<script type="text/javascript" src="js/editor.js"></script>
<%@ include file="/jsp/googleAnalytics.jsf" %>
<script type="text/javascript">
/** Piwik **/
var _paq = _paq || [];
_paq.push(["trackPageView"]);
_paq.push(["enableLinkTracking"]);

(function() {
  var u=(("https:" == document.location.protocol) ? "https" : "http") + "://stats.framasoft.org/";
  _paq.push(["setTrackerUrl", u+"piwik.php"]);
  _paq.push(["setSiteId", "12"]);
  var d=document, g=d.createElement("script"), s=d.getElementsByTagName("script")[0]; g.type="text/javascript";
  g.defer=true; g.async=true; g.src=u+"piwik.js"; s.parentNode.insertBefore(g,s);
})();
/** Fin Piwik **/
</script>
</body>
</html>
