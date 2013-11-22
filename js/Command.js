/**
 * Creates a new command. Base class for all commands
 * 
 * @constructor
 * @borrows EventEmitter
 */
mindmaps.Command = function() {
  this.id = "BASE_COMMAND";
  this.shortcut = null;
  /**
   * The handler function.
   * 
   * @private
   * @function
   */
  this.handler = null;
  this.label = null;
  this.description = null;

  /**
   * @private
   */
  this.enabled = false;
};

/**
 * Events that can be emitted by a command object.
 * @namespace
 */
mindmaps.Command.Event = {
  HANDLER_REGISTERED : "HandlerRegisteredCommandEvent",
  HANDLER_REMOVED : "HandlerRemovedCommandEvent",
  ENABLED_CHANGED : "EnabledChangedCommandEvent"
};

mindmaps.Command.prototype = {
  /**
   * Executes the command. Tries to call the handler function.
   */
  execute : function() {
    if (this.handler) {
      this.handler();
      if (mindmaps.DEBUG) {
        console.log("handler called for", this.id);
      }
    } else {
      if (mindmaps.DEBUG) {
        console.log("no handler found for", this.id);
      }
    }
  },

  /**
   * Registers a new handler.
   * 
   * @param {Function} handler
   */
  setHandler : function(handler) {
    this.removeHandler();
    this.handler = handler;
    this.publish(mindmaps.Command.Event.HANDLER_REGISTERED);
  },

  /**
   * Removes the current handler.
   */
  removeHandler : function() {
    this.handler = null;
    this.publish(mindmaps.Command.Event.HANDLER_REMOVED);
  },

  /**
   * Sets the enabled state of the command.
   * 
   * @param {Boolean} enabled
   */
  setEnabled : function(enabled) {
    this.enabled = enabled;
    this.publish(mindmaps.Command.Event.ENABLED_CHANGED, enabled);
  }
};
/**
 * Mixin EventEmitter into command objects.
 */
EventEmitter.mixin(mindmaps.Command);

/**
 * Node commands
 */

/**
 * Creates a new CreateNodeCommand.
 * 
 * @constructor
 * @augments mindmaps.Command
 */
mindmaps.CreateNodeCommand = function() {
  this.id = "CREATE_NODE_COMMAND";
  this.shortcut = "tab";
  this.label = "Ajouter";
  this.icon = "ui-icon-plusthick";
  this.description = "Cr\351e un nouveau noeud";
};
mindmaps.CreateNodeCommand.prototype = new mindmaps.Command();

/**
 * Creates a new CreateSiblingNodeCommand.
 * 
 * @constructor
 * @augments mindmaps.Command
 */
mindmaps.CreateSiblingNodeCommand = function() {
  this.id = "CREATE_SIBLING_NODE_COMMAND";
  this.shortcut = "shift+tab";
  this.label = "Ajouter";
  this.icon = "ui-icon-plusthick";
  this.description = "Cr\351e un nouveau noeud";
};
mindmaps.CreateSiblingNodeCommand.prototype = new mindmaps.Command();

/**
 * Creates a new DeleteNodeCommand.
 * 
 * @constructor
 * @augments mindmaps.Command
 */
mindmaps.DeleteNodeCommand = function() {
  this.id = "DELETE_NODE_COMMAND";
  this.shortcut = ["del", "backspace"];
  this.label = "Effacer";
  this.icon = "ui-icon-minusthick";
  this.description = "Efface un noeud";
};
mindmaps.DeleteNodeCommand.prototype = new mindmaps.Command();

/**
 * Creates a new EditNodeCaptionCommand.
 * 
 * @constructor
 * @augments mindmaps.Command
 */
mindmaps.EditNodeCaptionCommand = function() {
  this.id = "EDIT_NODE_CAPTION_COMMAND";
  this.shortcut = ["F2", "return"];
  this.label = "Editer le noeud";
  this.description = "Edite le texte du noeud";
};
mindmaps.EditNodeCaptionCommand.prototype = new mindmaps.Command();

/**
 * Creates a new ToggleNodeFoldedCommand.
 * 
 * @constructor
 * @augments mindmaps.Command
 */
mindmaps.ToggleNodeFoldedCommand = function() {
  this.id = "TOGGLE_NODE_FOLDED_COMMAND";
  this.shortcut = "space";
  this.description = "Affiche ou cache les noeuds-fils";
};
mindmaps.ToggleNodeFoldedCommand.prototype = new mindmaps.Command();

/**
 * Undo commands
 */

/**
 * Creates a new UndoCommand.
 * 
 * @constructor
 * @augments mindmaps.Command
 */
mindmaps.UndoCommand = function() {
  this.id = "UNDO_COMMAND";
  this.shortcut = ["ctrl+z", "meta+z"];
  this.label = "Annuler";
  this.icon = "ui-icon-arrowreturnthick-1-w";
  this.description = "Annule";
};
mindmaps.UndoCommand.prototype = new mindmaps.Command();

/**
 * Creates a new RedoCommand.
 * 
 * @constructor
 * @augments mindmaps.Command
 */
mindmaps.RedoCommand = function() {
  this.id = "REDO_COMMAND";
  this.shortcut = ["ctrl+y", "meta+shift+z"];
  this.label = "R\351tablir";
  this.icon = "ui-icon-arrowreturnthick-1-e";
  this.description = "R\351tablit";
};
mindmaps.RedoCommand.prototype = new mindmaps.Command();

/**
 * Clipboard commands
 */

/**
 * Creates a new CopyNodeCommand.
 * 
 * @constructor
 * @augments mindmaps.Command
 */
mindmaps.CopyNodeCommand = function() {
  this.id = "COPY_COMMAND";
  this.shortcut = ["ctrl+c", "meta+c"];
  this.label = "Copier";
  this.icon = "ui-icon-copy";
  this.description = "Copie une branche";
};
mindmaps.CopyNodeCommand.prototype = new mindmaps.Command();

/**
 * Creates a new CutNodeCommand.
 * 
 * @constructor
 * @augments mindmaps.Command
 */
mindmaps.CutNodeCommand = function() {
  this.id = "CUT_COMMAND";
  this.shortcut = ["ctrl+x", "meta+x"];
  this.label = "Couper";
  this.icon = "ui-icon-scissors";
  this.description = "Coupe une branche";
};
mindmaps.CutNodeCommand.prototype = new mindmaps.Command();

/**
 * Creates a new PasteNodeCommand.
 * 
 * @constructor
 * @augments mindmaps.Command
 */
mindmaps.PasteNodeCommand = function() {
  this.id = "PASTE_COMMAND";
  this.shortcut = ["ctrl+v", "meta+v"];
  this.label = "Coller";
  this.icon = "ui-icon-clipboard";
  this.description = "Colle une branche";
};
mindmaps.PasteNodeCommand.prototype = new mindmaps.Command();

/**
 * Document commands
 */

/**
 * Creates a new NewDocumentCommand.
 * 
 * @constructor
 * @augments mindmaps.Command
 */
mindmaps.NewDocumentCommand = function() {
  this.id = "NEW_DOCUMENT_COMMAND";
  this.label = "Nouveau";
  this.icon = "ui-icon-document-b";
  this.description = "Ouvre une nouvelle carte mentale";
};
mindmaps.NewDocumentCommand.prototype = new mindmaps.Command();

/**
 * Creates a new OpenDocumentCommand.
 * 
 * @constructor
 * @augments mindmaps.Command
 */
mindmaps.OpenDocumentCommand = function() {
  this.id = "OPEN_DOCUMENT_COMMAND";
  this.label = "Ouvrir...";
  this.shortcut = ["ctrl+o", "meta+o"];
  this.icon = "ui-icon-folder-open";
  this.description = "Ouvre une carte existante";
};
mindmaps.OpenDocumentCommand.prototype = new mindmaps.Command();

/**
 * Creates a new SaveDocumentCommand.
 * 
 * @constructor
 * @augments mindmaps.Command
 */
mindmaps.SaveDocumentCommand = function() {
  this.id = "SAVE_DOCUMENT_COMMAND";
  this.label = "Enregistrer...";
  this.shortcut = ["ctrl+s", "meta+s"];
  this.icon = "ui-icon-disk";
  this.description = "Enregistre la carte mentale";
};
mindmaps.SaveDocumentCommand.prototype = new mindmaps.Command();

/**
 * Creates a new CloseDocumentCommand.
 * 
 * @constructor
 * @augments mindmaps.Command
 */
mindmaps.CloseDocumentCommand = function() {
  this.id = "CLOSE_DOCUMENT_COMMAND";
  this.label = "Fermer";
  this.icon = "ui-icon-close";
  this.description = "Ferme la carte mentale";
};
mindmaps.CloseDocumentCommand.prototype = new mindmaps.Command();

/**
 * Creates a new HelpCommand.
 * 
 * @constructor
 * @augments mindmaps.Command
 */
mindmaps.HelpCommand = function() {
  this.id = "HELP_COMMAND";
  this.enabled = true;
  this.icon = "ui-icon-help";
  this.label = "Aide";
  this.shortcut = "F1";
  this.description = "Aide!";
};
mindmaps.HelpCommand.prototype = new mindmaps.Command();

/**
 * Creates a new PrintCommand.
 * 
 * @constructor
 * @augments mindmaps.Command
 */
mindmaps.PrintCommand = function() {
  this.id = "PRINT_COMMAND";
  this.icon = "ui-icon-print";
  this.label = "Imprimer";
  this.shortcut = ["ctrl+p", "meta+p"];
  this.description = "Imprime la carte mentale";
};
mindmaps.PrintCommand.prototype = new mindmaps.Command();

/**
 * Creates a new ExportCommand.
 * 
 * @constructor
 * @augments mindmaps.Command
 */
mindmaps.ExportCommand = function() {
  this.id = "EXPORT_COMMAND";
  this.icon = "ui-icon-image";
  this.label = "Exporter comme image...";
  this.description = "Exporte la carte mentale";
};
mindmaps.ExportCommand.prototype = new mindmaps.Command();
