<%@page pageEncoding="UTF-8" %>
<%@include file="/jsp/init.jsp" %>

<div>
    <h2 style="font-weight:bold;">Merci de vous être inscrit !</h2>
    <c:if test="${confirmByEmail==true}">
        <p>
            <spring:message code="SIGN_UP_CONFIRMATION_EMAIL"/>
        </p>
        <br/>

        <p>
            Thanks so much for your interest in WiseMapping.
        </p>
        <br/>

        <p>
            If you have any questions or have any feedback, please don't hesitate to use the on line form.
            We'd love to hear from you.
        </p>
    </c:if>
    <c:if test="${confirmByEmail==false}">
        <p>
           Votre compte a été créé, vous pouvez vous connecter dès à presént et commencer à apprécier Framindmap.
        </p>

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
                 <a class="text-primary" href="<c:url value="/c/user/resetPassword"/>" title='<spring:message code="FORGOT_PASSWORD"/>'
                    style="margin-left:-30px; margin-right:15px;font-size:20px;vertical-align:middle">
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


    </c:if>

</div>
