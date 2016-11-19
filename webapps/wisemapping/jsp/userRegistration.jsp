<%@page pageEncoding="UTF-8" %>
<%@include file="/jsp/init.jsp" %>
</div></div>

<script type="text/javascript">
jQuery( document ).ready(function() {
    jQuery('.form-separator').hide();

    jQuery('#Formulaire').append(jQuery('#SignIn'));
    jQuery('#Formulaire').append(jQuery('#SignUp'));

    jQuery('#SignUp').hide();
    jQuery('#SignIn').hide();
    jQuery('#Formulaire').show();
    jQuery('#SignUp').slideDown();

    if(window.location.hash=="#Formulaire") {
        jQuery('#SignUp #email').focus();
    }

    jQuery('a[href*="#SignIn"]').on('click', function() {
        if ( $("#SignIn").is(":hidden") ) {
           jQuery('#SignUp').slideUp(); 
           jQuery('#SignIn').slideDown();
        } else {
           jQuery('#SignUp').slideUp();
        }
        jQuery('#SignIn #email').focus();
        return false;
    });
    jQuery('a[href*="#SignUp"]').on('click', function() {
        if ( $("#SignUp").is(":hidden") ) {
           jQuery('#SignIn').slideUp();
           jQuery('#SignUp').slideDown();
        } else {
           jQuery('#SignIn').slideUp();  
        }
        jQuery('#SignUp #email').focus();
        return false;
    });
});
</script>

        <div class="col-md-8">
            <p class="text-center"><img src="/images/framindmap.png" alt="" style="width:85%"/></p><br />
            <div class="col-md-6 text-center" style="margin:20px 0">
                <a href="c/user/registration#SignIn" class="btn btn-primary btn-lg"><span class="glyphicon glyphicon-lock"></span> Se connecter »</a>
            </div>
            <div class="col-md-6 text-center" style="margin:20px 0">
                <a href="c/user/registration#SignUp" class="btn btn-success btn-lg"><span class="glyphicon glyphicon-user"></span> Créer un compte »</a>
            </div>
        </div>

<jsp:include page="framindmap.jsp"></jsp:include>

<hr class="form-separator">
<div class="row">
    <div class="col-md-8 col-md-offset-2" id="SignIn">
        <h2><span class="glyphicon glyphicon-lock"></span> Se connecter</h2>
        <form action="<c:url value='/c/j_spring_security_check'/>" method="POST" class="form-inline" style="max-width:630px" id="loginForm">
             <div class="form-group">
                 <label class="sr-only control-label" for="email"><spring:message code="EMAIL"/>: </label>
                 <input type='email' tabindex="1" id="email" name='j_username' required="required" class="form-control" placeholder='<spring:message code="EMAIL"/>'/>
             </div>
             <div class="form-group">
                 <label class="sr-only control-label" for="password"><spring:message code="PASSWORD"/>: </label>
                 <input type='password' tabindex="2" id="password" name='j_password' required="required" class="form-control" placeholder='<spring:message code="PASSWORD"/>'/>
                 <a href="<c:url value="/c/user/resetPassword"/>" class="text-primary" title='<spring:message code="FORGOT_PASSWORD"/>'
                    style="margin-left:-30px; margin-right:15px;font-size: 20px;vertical-align:middle;border:none;">
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

<hr class="form-separator">
<div class="row">
    <div class="col-md-8 col-md-offset-2" id="SignUp">
        <h2><span class="glyphicon glyphicon-user"></span> Créer un compte</h2>
	<form:form method="post" commandName="user" class="form-horizontal" style="max-width:630px">

    <div class="form-group">
        <label for="email" class="col-md-4 control-label"><spring:message code="EMAIL"/>: </label>
        <div class="col-md-7">
            <form:input path="email" id="email" type="email" required="required" class="form-control"/>
            <form:errors path="email" cssClass="errorMsg text-danger"/>
        </div>
    </div>
    <div class="form-group">
        <label for="firstname" class="col-md-4 control-label"><spring:message code="FIRSTNAME"/>: </label>

        <div class="col-md-7">
            <form:input path="firstname" id="firstname" required="required" class="form-control"/>
            <form:errors path="firstname" cssClass="errorMsg text-danger"/>
        </div>
    </div>
    <div class="form-group">
        <label for="lastname" class="col-md-4 control-label"><spring:message code="LASTNAME"/>: </label>

        <div class="col-md-7">
            <form:input path="lastname" id="lastname" required="required" class="form-control"/>
            <form:errors path="lastname" cssClass="errorMsg text-danger"/>
        </div>
    </div>
    <div class="form-group">
        <label for="password" class="col-md-4 control-label"><spring:message code="PASSWORD"/>: </label>

        <div class="col-md-7">
            <form:password path="password" id="password" required="required" class="form-control"/>
            <form:errors path="password" cssClass="errorMsg text-danger"/>
        </div>
    </div>
    <div class="form-group">
        <label for="retypePassword" class="col-md-4 control-label"><spring:message
                code="RETYPE_PASSWORD"/>: </label>
        <div class="col-md-7">
            <form:password path="retypePassword" id="retypePassword" class="form-control"/>
            <form:errors path="retypePassword" cssClass="errorMsg text-danger"/>
        </div>
    </div>
<!--   <div class="form-group">
        <div class="col-md-10 col-md-offset-2">
            <c:if test="${requestScope.captchaEnabled}">
                ${requestScope.captchaHtml}
                <p>
                    <form:errors path="captcha" cssClass="errorMsg text-danger"/>
                </p>
            </c:if>
        </div>
    </div>-->
    <div class="form-group">
        <p>
            Tous les champs de ce formulaire sont requis pour le bon fonctionnement du logiciel.
            Cependant, il n'est pas nécessaire que vous nous donniez votre véritable identité.
        </p>
        <p>Merci de vérifier les informations que vous avez saisies et de relire les <a href="https://framasoft.org/nav/html/cgu.html">Conditions Générales d'Utilisation</a>.</p>
        <p>En cliquant sur le bouton « Créer le compte » ci-dessous, vous vous engagez à les respecter.</p>
        <p class="text-center">
            <input type="submit" value="Créer le compte"
                   data-loading-text="Créer le compte ..." id="submitButton"
                   class="btn btn-success">
        </p>
    </div>

        </form:form>
    </div>
</div>

<div><div><div>
