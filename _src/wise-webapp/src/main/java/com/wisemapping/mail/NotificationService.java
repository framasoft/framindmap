/*
*    Copyright [2015] [wisemapping]
*
*   Licensed under WiseMapping Public License, Version 1.0 (the "License").
*   It is basically the Apache License, Version 2.0 (the "License") plus the
*   "powered by wisemapping" text requirement on every single page;
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the license at
*
*       http://www.wisemapping.org/license
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

package com.wisemapping.mail;

import com.wisemapping.filter.SupportedUserAgent;
import com.wisemapping.model.Collaboration;
import com.wisemapping.model.Mindmap;
import com.wisemapping.model.User;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringEscapeUtils;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

final public class NotificationService {

    public static final String DEFAULT_WISE_URL = "http://localhost:8080/wisemapping";
    @Autowired
    private Mailer mailer;

    private NotifierFilter notificationFilter;

    private String baseUrl;

    public NotificationService() {
        this.notificationFilter = new NotifierFilter();
    }

    public void newCollaboration(@NotNull Collaboration collaboration, @NotNull Mindmap mindmap, @NotNull User user, @Nullable String message) {

        try {
            // Sent collaboration email ...
            final String formMail = mailer.getServerSenderEmail();

            // Is the user already registered user ?.
            final String collabEmail = collaboration.getCollaborator().getEmail();

            // Build the subject ...
            final String subject = "[Framindmap] " + user.getFullName() + " a partagé une carte mentale avec vous";

            // Fill template properties ...
            final Map<String, Object> model = new HashMap<String, Object>();
            model.put("mindmap", mindmap);
            model.put("message", "message");
            model.put("ownerName", user.getFirstname());
            model.put("mapEditUrl", getBaseUrl() + "/c/maps/" + mindmap.getId() + "/edit");
            model.put("baseUrl", getBaseUrl());
            model.put("senderMail", user.getEmail());
            model.put("message", message);
            model.put("supportEmail", mailer.getSupportEmail());

            mailer.sendEmail(formMail, collabEmail, subject, model, "newCollaboration.vm");
        } catch (Exception e) {
            handleException(e);
        }

    }

    public void resetPassword(@NotNull User user, @NotNull String temporalPassword) {
        final String mailSubject = "[Framindmap] Votre nouveau mot de passe";
        final String messageTitle = "Votre nouveau mot de passe a &eacute;t&eacute; cr&eacute;&eacute;";
        final String messageBody =
                "<p>Quelqu'un, probablement vous, a demand&eacute; &agrave; r&eacuteinitialiser le mot de passe de votre compte Framindmap. </p>\n" +
                        "<p><strong>Voici votre nouveau mot de passe&nbsp;: " + temporalPassword + "</strong></p>\n" +
                        "<p>Vous pouvez vous connecter en cliquant <a href=\"" + getBaseUrl() + "/c/login\">sur ce lien</a>. Nous vous encourageons fortement &agrave; changer ce mot de passe le plus rapidement possible.</p>";

        sendTemplateMail(user, mailSubject, messageTitle, messageBody);
    }

    public void passwordChanged(@NotNull User user) {
        final String mailSubject = "[Framindmap] Votre mot de passe a été modifié";
        final String messageTitle = "Votre nouveau mot de passe a bien &eacute;t&eacute; modifi&eacute; correctement";
        final String messageBody =
                "<p>Ceci est juste un mail de confirmation que votre mot de passe a bien &eacute;t&eacute; chang&eacute;. Aucune action suppl&eacute;mentaire n'est requise.</p>";

        sendTemplateMail(user, mailSubject, messageTitle, messageBody);
    }

    public void newAccountCreated(@NotNull User user) {
        final String mailSubject = "Bienvenue dans Framindmap !";
        final String messageTitle = "Votre compte a &eacute;t&eacute; cr&eacute;&eacute; avec succ&eagrave;s";
        final String messageBody =
                "<p>Merci de l'int&eacute;r&ecirc;t que vous portez &agrave; Framindmap. Si vous avez des remarques ou id&eacute;es d'am&eacute;lioration, envoyez nous un email sur <a href=\"https://contact.framasoft.org/#framindmap\">contact.framasoft.org</a>.</p>";
        sendTemplateMail(user, mailSubject, messageTitle, messageBody);
    }

    private void sendTemplateMail(@NotNull User user, @NotNull String mailSubject, @NotNull String messageTitle, @NotNull String messageBody) {

        try {
            final Map<String, Object> model = new HashMap<String, Object>();
            model.put("firstName", user.getFirstname());
            model.put("messageTitle", messageTitle);
            model.put("messageBody", messageBody);
            model.put("baseUrl", getBaseUrl());
            model.put("supportEmail", mailer.getSupportEmail());

            mailer.sendEmail(mailer.getServerSenderEmail(), user.getEmail(), mailSubject, model, "baseLayout.vm");
        } catch (Exception e) {
            handleException(e);
        }
    }

    private void handleException(Exception e) {
        System.err.println("An expected error has occurred trying to send an email notification. Usually, the main reason for this is that the SMTP server properties has not been configured properly. Edit the WEB-INF/app.properties file and verify the SMTP server configuration properties.");
        System.err.println("Cause:" + e.getMessage());

    }

    public void setMailer(Mailer mailer) {
        this.mailer = mailer;
    }


    public void activateAccount(@NotNull User user) {
        final Map<String, User> model = new HashMap<String, User>();
        model.put("user", user);
        mailer.sendEmail(mailer.getServerSenderEmail(), user.getEmail(), "[WiseMapping] Active account", model, "activationAccountMail.vm");
    }

    public void sendRegistrationEmail(@NotNull User user) {
//        throw new UnsupportedOperationException("Not implemented yet");
//        try {
//            final Map<String, String> model = new HashMap<String, String>();
//            model.put("email", user.getEmail());
////            final String activationUrl = "http://wisemapping.com/c/activation?code=" + user.getActivationCode();
////            model.put("emailcheck", activationUrl);
////            mailer.sendEmail(mailer.getServerSenderEmail(), user.getEmail(), "Welcome to Wisemapping!", model,
////                    "confirmationMail.vm");
//        } catch (Exception e) {
//            handleException(e);
//        }
    }

    public void reportJavascriptException(@Nullable Mindmap mindmap, @Nullable User user, @Nullable String jsErrorMsg, @NotNull HttpServletRequest request) {

        final Map<String, String> model = new HashMap<String, String>();
        model.put("errorMsg", jsErrorMsg);
        try {
            model.put("mapXML", StringEscapeUtils.escapeXml(mindmap == null ? "map not found" : mindmap.getXmlStr()));
        } catch (UnsupportedEncodingException e) {
            // Ignore ...
        }
        model.put("mapId", Integer.toString(mindmap.getId()));
        model.put("mapTitle", mindmap.getTitle());

        sendNotification(model, user, request);
    }

    private void sendNotification(@NotNull Map<String, String> model, @Nullable User user, @NotNull HttpServletRequest request) {
        model.put("fullName", (user != null ? user.getFullName() : "'anonymous'"));
        final String userEmail = user != null ? user.getEmail() : "'anonymous'";

        model.put("email", userEmail);
        model.put("userAgent", request.getHeader(SupportedUserAgent.USER_AGENT_HEADER));
        model.put("server", request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort());
        model.put("requestURI", request.getRequestURI());
        model.put("method", request.getMethod());
        model.put("remoteAddress", request.getRemoteAddr());

        try {
            final String errorReporterEmail = mailer.getErrorReporterEmail();
            if (errorReporterEmail != null && !errorReporterEmail.isEmpty()) {

                if (!notificationFilter.hasBeenSend(userEmail, model)) {
                    mailer.sendEmail(mailer.getServerSenderEmail(), errorReporterEmail, "[WiseMapping] Bug from '" + (user != null ? user.getEmail() + "'" : "'anonymous'"), model,
                            "errorNotification.vm");
                }
            }
        } catch (Exception e) {
            handleException(e);
        }
    }

    public void reportJavaException(@NotNull Throwable exception, @Nullable User user, @NotNull String content, @NotNull HttpServletRequest request) {
        final Map<String, String> model = new HashMap<String, String>();
        model.put("errorMsg", stackTraceToString(exception));
        model.put("mapXML", StringEscapeUtils.escapeXml(content));

        sendNotification(model, user, request);
    }

    public void reportJavaException(@NotNull Throwable exception, @Nullable User user, @NotNull HttpServletRequest request) {
        final Map<String, String> model = new HashMap<String, String>();
        model.put("errorMsg", stackTraceToString(exception));

        sendNotification(model, user, request);
    }

    public String stackTraceToString(@NotNull Throwable e) {
        String retValue = null;
        StringWriter sw = null;
        PrintWriter pw = null;
        try {
            sw = new StringWriter();
            pw = new PrintWriter(sw);
            e.printStackTrace(pw);
            retValue = sw.toString();
        } finally {
            IOUtils.closeQuietly(pw);
            IOUtils.closeQuietly(sw);
        }
        return retValue;
    }

    public String getBaseUrl() {
        if ("${site.baseurl}".equals(baseUrl)) {
            baseUrl = DEFAULT_WISE_URL;
            System.err.println("Warning: site.baseurl has not being configured. Mail site references could be not properly sent. Using :" + baseUrl);
        }
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }
}


