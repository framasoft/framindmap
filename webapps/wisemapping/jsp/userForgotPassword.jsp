<%@page pageEncoding="UTF-8" %>
<%@include file="/jsp/init.jsp" %>
<h2>
    <spring:message code="FORGOT_PASSWORD"/>
</h2>

<p>Merci de saisir votre adresse email pour nous aider à retrouver votre compte.</p>

<form:form method="post" commandName="resetPassword" class="form-horizontal">
    <label for="email" class="col-md-2 control-label"><spring:message code="EMAIL"/>: </label>
    <div class="col-md-5">
        <input id="email" type="email" required="required" name="email" class="form-control"/>
    </div>
    <input type="submit" value="<spring:message code="SEND_ME_A_NEW_PASSWORD"/>" class="btn btn-primary"
           data-loading-text="<spring:message code="SENDING"/>"/>
    <input type="button" value="<spring:message code="CANCEL"/>" class="btn"
           onclick="window.location='<c:url value="c/maps/"/>'"/>
</form:form>
