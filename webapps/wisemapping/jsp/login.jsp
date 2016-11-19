<%@page pageEncoding="UTF-8" %>
<%@ include file="/jsp/init.jsp" %>

<%--@elvariable id="isHsql" type="boolean"--%>

<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript">
jQuery(document).ready(function() {
    jQuery('.form-separator').hide();

    jQuery('#Formulaire').append(jQuery('#SignIn'));

    jQuery('a[href*="#SignIn"]').on('click', function() {
        jQuery('#Formulaire').slideDown('slow');
    
        if ( $("#SignIn").is(":hidden") ) {
           jQuery('#SignUp').slideUp();
           jQuery('#SignIn').slideDown(); 
           jQuery('#SignUp').hide();
        } else {
           jQuery('#SignUp').hide();
        }
        $('#SignIn #email').focus();
        return false;
    });
});
   
</script>

<div class="form-group">
    <c:if test="${not empty param.login_error}">
         <c:choose>
             <c:when test="${param.login_error == 3}">
                 <div class="alert alert-warning"><spring:message code="USER_INACTIVE"/></div>
             </c:when>
             <c:otherwise>
                 <div class="alert alert-warning"><spring:message code="LOGIN_ERROR"/></div>
             </c:otherwise>
         </c:choose>
    </c:if>
</div>

</div></div>

        <div class="col-md-8">
            <p class="text-center"><img src="/images/framindmap.png" alt="" style="width:85%"/></p><br />
            <div class="col-md-6 text-center" style="margin:20px 0">
                <a href="c/login#SignIn" class="btn btn-primary btn-lg"><span class="glyphicon glyphicon-lock"></span> Se connecter »</a>
            </div>
            <div class="col-md-6 text-center" style="margin:20px 0">
                <a href="c/user/registration#Formulaire" class="btn btn-success btn-lg"><span class="glyphicon glyphicon-user"></span> Créer un compte »</a>
            </div>
        </div>

<jsp:include page="framindmap.jsp"></jsp:include>

<hr class="form-separator">
<div class="row">
    <div class="col-md-8 col-md-offset-2" id="SignIn">
        <h2><span class="glyphicon glyphicon-lock"></span> Se connecter</h2>
        <form action="<c:url value='/c/j_spring_security_check'/>" method="POST" class="form-inline" style="max-width:680px" id="loginForm">
             <div class="form-group">
                 <label class="sr-only control-label" for="email"><spring:message code="EMAIL"/>: </label>
                 <input type='email' tabindex="1" id="email" name='j_username' required="required" class="form-control" placeholder='<spring:message code="EMAIL"/>'/>
             </div>
             <div class="form-group">
                 <label class="sr-only control-label" for="password"><spring:message code="PASSWORD"/>: </label>
                 <input type='password' tabindex="2" id="password" name='j_password' required="required" class="form-control" placeholder='<spring:message code="PASSWORD"/>'/>
                 <a href="<c:url value="/c/user/resetPassword"/>" class="text-primary" title='<spring:message code="FORGOT_PASSWORD"/>'
                    style="margin-left:-30px; margin-right:15px;font-size: 20px;vertical-align:middle; border:none">
                    <span class="glyphicon glyphicon-question-sign"></span>
                 </a>
             </div>
             <button class="btn btn-primary" tabindex="4" data-loading-text="<spring:message code="SIGN_ING"/>">
                    <spring:message code="SIGN_IN"/></button>
             <div class="form-group">
                 <input type="checkbox" id="rememberme" name="_spring_security_remember_me"/>
                 <label for="rememberme">Rester connecté&nbsp;?</label>
             </div>
         </form>
    </div>
</div>

<div><div><div>
