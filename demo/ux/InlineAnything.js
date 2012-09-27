/**
 * A Grid/TreeGrid plugin which provides the ability to inline any ExtJS component.  Extends the ExtJS framework plugin 
 * Ext.grid.plugin.Editing to obtain baseline presentation/positioning functionality.
 *
 * Required configs:
 *
 *     inlineConfigs: Config object of Functions named by Column dataIndex's.  Functions will be passed
 *                    a record and column reference as argumnets.  The functions should return a config
 *                    Object which will be passed to Ext.
 *
 * Optional configs:
 *
 *     floaterConfig: A Config object whose settings will be applied when creating instances of Four59Cool.ux.InlineAnythingFloater,
 *                    supported properties:
 *
 *                                floaterMoveDuration: default is 150
 *
 *                                headerMoveDuration: default is 300
 *
 *                                position: Can be 'under' or 'over', default is 'under'
 *
 *     inlineChecks: Config object of Functions named by Column dataIndex's.  Functions will be passed
 *                   an editing context object returned by Ext.grid.plugin.Editing.getEditingContext().
 *                   The functions defined should return true/false Booleans only, which will determine
 *                   if an inline component should be created given the inputs
 *   
 *     clicksToMove: Number of clicks (1 or 2) to move the inline component display.  Default is 1.
 *
 *     checkField: If set, a Boolean field name to check whether to display details or not  
 *
 * @author Alex Sherwin
 * @license Apache 2.0
 */
Ext.define('Four59Cool.ux.InlineAnything', {
    
    alias: 'plugin.inlineanything',
    extend: 'Ext.grid.plugin.Editing',
    requires: [
        'Four59Cool.ux.InlineAnythingFloater'
    ],

    // configs
    clicksToMove: 1,
    checkField: null,
    // TODO: create a detail loader type config (i.e. function to return config, already created component etc)

    /**
     * @private
     * Destroy the floater instance and local inlined components
     */
    destroy: function() {
        if (this.floater) {
          Ext.destroy(this.floater);
        }
        this.callParent(arguments);
    },
    
    /**
     * Check for an inlineChecks config, if it exists, check for a Column dataIndex specific function,
     * if that doesn't exist then check for a function named "default", if nothing matches then return false.
     *
     * If there is no inlineChecks config defined, return true by default.
     */
    beforeEdit: function(context) {
      if (this.inlineChecks) {
          if (this.inlineChecks.hasOwnProperty(context.field)) {
              return this.inlineChecks[context.field](context);
          } else if (this.inlineChecks.hasOwnProperty("default")) {
              return this.inlineChecks.default(context);
          } else {
              return false;
          }
      }
      return true;
    },

    /**
     * Overrides Ext.grid.plugin.Editing.startEdit.
     * 
     * Find the specified record,
     */
    startEdit: function(record, columnHeader) {
        var floater = this.getFloater();
        if (this.callParent(arguments) !== false) {
            var inlineFuncRef = this.getInlineFunction(this.context.record, this.context.column);
            floater.startEdit(this.context.record, this.context.column, inlineFuncRef);
            return true;
        }
        return false;
    },
    
    /**
     * Get a reference to the function which will return the inline component config.
     *
     * Based on the column/cell clicked on, check if there is a inline component defined specifically targeted for it,
     * i.e. inlineConfigs { } has a function with the column.dataIndex name.
     *
     * If no specific inline component config function is found, use one named "default"
     */
    getInlineFunction: function(record, column) {
      var inlineFuncRef;
      if (column.dataIndex && this.inlineConfigs.hasOwnProperty(column.dataIndex)) {
        inlineFuncRef = this.inlineConfigs[column.dataIndex];
      } else {
        inlineFuncRef = this.inlineConfigs.default;
      }
      return inlineFuncRef;
    },

    /**
     * Overrie the default initEditTriggers function to apply custom logic based on local config options 
     */
    initEditTriggers: function() {
        var view = this.view;
        var moveEventSuffix = 'click'; // default to single click
        if (this.clicksToMove == 2) { // only other option is 2 clicks, otherwise ignore what is set (bad data)
           var moveEventSuffix = 'dblclick';
        }

        this.callParent(arguments);

        // if the clicksToMove config differs from the built-in clicksToEdit, we need to monitor this and handle locally
        if (this.clicksToMove !== this.clicksToEdit) {
            this.mon(view, 'cell' + moveEventSuffix, this.moveFloaterFromClick, this);
        }
    },

    /**
     * Move the Four59Cool.ux.InlineAnythingFloater instance based on a mouse click/dblclick event
     */
    moveFloaterFromClick: function() {
        if (this.editing) {
            this.superclass.onCellClick.apply(this, arguments);
        }
    },

    /**
     * Create/maintain and return a singleton instance of Four59Cool.ux.InlineAnythingFloater
     */
    getFloater: function() {
        if (!this.floater) {
            this.floater = this.createFloater();
        }
        return this.floater;
    },

    /**
     * Create a floater instance, pass along configuration parameters from relevant  plugin config options
     */
    createFloater: function() {
        var localFloaterConfig = {
                hidden: true,
                gridColumns: this.grid.headerCt.getGridColumns(),
                view: this.view,
                inlineAnythingPlugin: this,
                renderTo: this.view.el
            };
            
        if (this.floaterConfig) {
            localFloaterConfig = Ext.applyIf(localFloaterConfig, this.floaterConfig);
        }
        
        return Ext.create('Four59Cool.ux.InlineAnythingFloater', localFloaterConfig);
    },

    /**
     * Override the default cancelEdit, close the floater and call the super
     */
    cancelEdit: function() {
        if (this.editing) {
            this.getFloater().cancelEdit();
            this.callParent(arguments);
        }
    }
});

