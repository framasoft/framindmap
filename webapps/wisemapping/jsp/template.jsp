<%@page pageEncoding="UTF-8" %>
<%@include file="/jsp/init.jsp" %>

<!DOCTYPE HTML>

<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<tiles:importAttribute name="title" scope="request"/>
<tiles:importAttribute name="details" scope="request"/>
<tiles:importAttribute name="removeSignin" scope="request" ignore="true"/>

<html>
<head>
    <base href="${requestScope['site.baseurl']}/">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="">
<meta name="author" content="">

    <title>Framindmap - 
        <c:choose>
            <c:when test="${requestScope.viewTitle!=null}">
                ${requestScope.viewTitle}
            </c:when>
            <c:otherwise>
                <spring:message code="${requestScope.title}"/>
            </c:otherwise>
        </c:choose></title>
    <link rel="stylesheet" type="text/css" href="css/pageTemplate.css"/>

    <link rel="icon" href="images/favicon.ico" type="image/x-icon"/>
    <link rel="shortcut icon" href="images/favicon.ico" type="image/x-icon"/>
    <script type="text/javascript" src="js/jquery.js"></script>

    <script type="text/javascript" src="bootstrap/js/bootstrap.min.js"></script>
    <script src="js/less.js" type="text/javascript"></script>
</head>
<body>
<script src="https://framasoft.org/nav/nav.js" type="text/javascript"></script>
<div id="pageContainer">
    <jsp:include page="header.jsp">
        <jsp:param name="removeSignin" value="${requestScope.removeSignin}"/>
    </jsp:include>

        <div class="row">
            <div class="col-md-offset-1 col-md-10">
                <div class="jumbotron" style="margin-bottom:10px;padding: 0px 60px;">
                    <tiles:insertAttribute name="body"/>
                </div>
            </div>
        </div>
        <jsp:include page="footer.jsp"/>                
    </main>
    </div>
</div>
</body>
</html>

