/**
 * <pre>
 * Listens to HELP_COMMAND and displays notifications.
 * Provides interactive tutorial for first time users.
 * </pre>
 * 
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.commandRegistry} commandRegistry
 */
mindmaps.HelpController = function(eventBus, commandRegistry) {

  /**
   * Prepare tutorial guiders.
   */
  function setupInteractiveMode() {
    if (isTutorialDone()) {
      console.debug("skipping tutorial");
      return;
    }

    var notifications = [];
    var interactiveMode = true;

    // start tutorial after a short delay
    eventBus.once(mindmaps.Event.DOCUMENT_OPENED, function() {
      setTimeout(start, 1000);
    });

    function closeAllNotifications() {
      notifications.forEach(function(n) {
        n.close();
      });
    }

    var helpMain, helpRoot;
    function start() {
      helpMain = new mindmaps.Notification(
          "#toolbar",
          {
            position : "bottomMiddle",
            maxWidth : 550,
            title : "Bienvenue sur Framindmap",
            content : "Bonjour, vous \352tes nouveau ici ? Ces bulles vous "
                + "guideront dans cette application. <a class='skip-tutorial link'>Cliquez ici<a/> pour passer ce tutoriel."
          });
      notifications.push(helpMain);
      helpMain.$().find("a.skip-tutorial").click(function() {
        interactiveMode = false;
        closeAllNotifications();
        tutorialDone();
      });
      setTimeout(theRoot, 2000);
    }

    function theRoot() {
      if (isTutorialDone())
        return;

      helpRoot = new mindmaps.Notification(
          ".node-caption.root",
          {
            position : "bottomMiddle",
            closeButton : true,
            maxWidth : 350,
            title : "C'est le point de d\351part - votre principale id\351e",
            content : "Double-cliquez sur l'id\351e pour modifier ce qui est \351crit. C'est le sujet principal de votre carte mentale."
          });
      notifications.push(helpRoot);

      eventBus.once(mindmaps.Event.NODE_TEXT_CAPTION_CHANGED, function() {
        helpRoot.close();
        setTimeout(theNub, 900);
      });
    }

    function theNub() {
      if (isTutorialDone())
        return;

      var helpNub = new mindmaps.Notification(
          ".node-caption.root",
          {
            position : "bottomMiddle",
            closeButton : true,
            maxWidth : 350,
            padding : 20,
            title : "Cr\351ation de nouvelles id\351es",
            content : "Il est maintenant temps de cr\351er votre carte mentale.<br/> D\351placez votre souris sur l'id\351e, cliquez et glissez"
                + " depuis <span style='color:red'>le rond rouge</span> vers un autre endroit. Vous venez ainsi de cr\351er une nouvelle branche."
          });
      notifications.push(helpNub);
      eventBus.once(mindmaps.Event.NODE_CREATED, function() {
        helpMain.close();
        helpNub.close();
        setTimeout(newNode, 900);
      });
    }

    function newNode() {
      if (isTutorialDone())
        return;

      var helpNewNode = new mindmaps.Notification(
          ".node-container.root > .node-container:first",
          {
            position : "bottomMiddle",
            closeButton : true,
            maxWidth : 350,
            title : "Votre premi\350re branche",
            content : "C'est facile, non ? Le rond rouge est l'outil le plus important. Vous pouvez maintenant d\351placer vos id\351es"
                + " en les faisant glisser ou modifier le texte en double-cliquant dessus."
          });
      notifications.push(helpNewNode);
      setTimeout(inspector, 2000);

      eventBus.once(mindmaps.Event.NODE_MOVED, function() {
        helpNewNode.close();
        setTimeout(navigate, 0);
        setTimeout(toolbar, 15000);
        setTimeout(menu, 10000);
        setTimeout(tutorialDone, 20000);
      });
    }

    function navigate() {
      if (isTutorialDone())
        return;

      var helpNavigate = new mindmaps.Notification(
          ".float-panel:has(#navigator)",
          {
            position : "bottomRight",
            closeButton : true,
            maxWidth : 350,
            expires : 10000,
            title : "Navigation",
            content : "Cliquer et glisser sur le fond de la carte permet de naviguer autour. La molette de la souris permet de zoomer."
          });
      notifications.push(helpNavigate);
    }

    function inspector() {
      if (isTutorialDone())
        return;

      var helpInspector = new mindmaps.Notification(
          "#inspector",
          {
            position : "leftBottom",
            closeButton : true,
            maxWidth : 350,
            padding : 20,
            title : "Vous n'aimez pas les couleurs?",
            content : "Utilisez les contr\364les de couleurs pour les modifier. "
                + "Essayez de cliquer sur l'ic\364ne dans le coin sup\351rieur droit pour r\351duire cette fen\352tre."
          });
      notifications.push(helpInspector);
    }

    function toolbar() {
      if (isTutorialDone())
        return;

      var helpToolbar = new mindmaps.Notification(
          "#toolbar .buttons-left",
          {
            position : "bottomLeft",
            closeButton : true,
            maxWidth : 350,
            padding : 20,
            title : "La barre d'outils",
            content : "Ces boutons font ce qu'ils disent. Vous pouvez les utiliser ou les raccourcis clavier. "
                + "Survolez-les les pour conna\356tre les combinaisons de touches."
          });
      notifications.push(helpToolbar);
    }

    function menu() {
      if (isTutorialDone())
        return;

      var helpMenu = new mindmaps.Notification(
          "#toolbar .buttons-right",
          {
            position : "leftTop",
            closeButton : true,
            maxWidth : 350,
            title : "Enregistrez votre travail",
            content : "Le bouton \340 droite ouvre le menu qui permet d'enregistrer votre carte mentale "
                + "ou d'en commencer une nouvelle."
          });
      notifications.push(helpMenu);
    }

    function isTutorialDone() {
      return mindmaps.LocalStorage.get("mindmaps.tutorial.done") == 1;
    }

    function tutorialDone() {
      mindmaps.LocalStorage.put("mindmaps.tutorial.done", 1);
    }

  }

  /**
   * Prepares notfications to show for help command.
   */
  function setupHelpButton() {
    var command = commandRegistry.get(mindmaps.HelpCommand);
    command.setHandler(showHelp);

    var notifications = [];
    function showHelp() {
      // true if atleast one notifications is still on screen
      var displaying = notifications.some(function(noti) {
        return noti.isVisible();
      });

      // hide notifications if visible
      if (displaying) {
        notifications.forEach(function(noti) {
          noti.close();
        });
        notifications.length = 0;
        return;
      }

      // show notifications
      var helpRoot = new mindmaps.Notification(
          ".node-caption.root",
          {
            position : "bottomLeft",
            closeButton : true,
            maxWidth : 350,
            title : "C'est votre id\351e principale",
            content : "Double-cliquez sur l'id\351e pour \351diter le texte. "
                + "Fa\356tes glisser le rond rouge pour cr\351er une nouvelle id\351e."
          });

      var helpNavigator = new mindmaps.Notification(
          "#navigator",
          {
            position : "leftTop",
            closeButton : true,
            maxWidth : 350,
            padding : 20,
            title : "C'est le navigateur",
            content : "Utilisez cette fen\352tre pour avoir un aper\347u de votre carte. "
                + "Vous pouvez naviguer en glissant autour du rectangle rouge ou en modifiant le zoom en cliquant sur les boutons de loupe."
          });

      var helpInspector = new mindmaps.Notification(
          "#inspector",
          {
            position : "leftTop",
            closeButton : true,
            maxWidth : 350,
            padding : 20,
            title : "C'est le contr\364leur",
            content : "Utilisez ces commandes pour modifier l'apparence de vos id\351es."
                + "Essayez de cliquer sur l'ic\364ne dans le coin sup\351rieur droit pour r\351duire cette fen\352tre. "
          });

      var helpToolbar = new mindmaps.Notification(
          "#toolbar .buttons-left",
          {
            position : "bottomLeft",
            closeButton : true,
            maxWidth : 350,
            title : "C'est la barre d'outils",
            content : "Ces boutons font ce qu'ils disent. Vous pouvez les utiliser ou les raccourcis clavier. "
                + "Survolez-les les pour conna\356tre les combinaisons de touches."
          });

      notifications.push(helpRoot, helpNavigator, helpInspector,
          helpToolbar);
    }
  }

  setupInteractiveMode();
  setupHelpButton();
};
