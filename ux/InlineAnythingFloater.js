/**
 * A private, visual Panel class used by Four59Cool.ux.InlineAnything for display purposes
 *
 * @author Alex Sherwin
 */
Ext.define('Four59Cool.ux.InlineAnythingFloater', {
    extend: 'Ext.panel.Panel',
    
    // configs
    controlButtonsWidth: 140,
    closeButtonText: 'Close',
    moveDuration: 125,
    position: 'under',

    // settings
    border: false,
    layout: 'fit',
    hideMode: 'offsets',

    /**
     * Setup visual styles and listeners for local events
     */
    initComponent: function() {
        // reuse the row editing plugin css style(s)
        this.cls = Ext.baseCSSPrefix + 'grid-row-editor';

        // default/super initComponent behavior
        this.callParent(arguments);
        
        this.mon(Ext.container.Container.hierarchyEventSource, {
            scope: this,
            show: this.maybeReposition
        });
    },

    /**
     * Setup event listeneres for scrolling and view events
     */
    afterRender: function() {
        var plugin = this.inlineAnythingPlugin;

        this.callParent(arguments);
        
        // add a monitor for scroll events, to be used for repositioning the display
        this.mon(this.renderTo, 'scroll', this.onScroll, this, { buffer: 100 });

        // monitor for before, refresh and item remove events so that this visual Floater
        // can automatically move/adjust if possible when the view and/or underlying data changes
        this.mon(plugin.view, {
            scope: this,
            beforerefresh: this.onBeforeViewRefresh,
            refresh: this.onViewRefresh,
            itemremove: this.onViewItemRemove
        });
    },

    /**
     * Before a view refresh, remove this Floater from the DOM
     */
    onBeforeViewRefresh: function(view) {
        if (this.el.dom.parentNode === view.el.dom) {
            view.el.dom.removeChild(this.el.dom);
        }
    },

    /**
     * On a view refresh, find and move the Floater if possible, otherwise close it
     */
    onViewRefresh: function(view) {
        // add this Floater into the DOM
        view.el.dom.appendChild(this.el.dom);

        // find the new index (if it exists), and reposition; else hide the Floater (cancel the edit)
        // null check is needed, observed this.context.store as being null when a floater is visible and a tree grid is sorted
        var idx = (this.context && this.context.store) ? this.context.store.indexOf(this.context.record) : -1;
        if (this.context && idx >= 0) {
            this.context.row = view.getNode(idx);
            this.doReposition();
        } else {
            this.inlineAnythingPlugin.cancelEdit();
        }
    },

    /**
     * If the item is removed, close the Floater
     */
    onViewItemRemove: function(record, index) {
        if (this.context && record === this.context.record) {
            this.inlineAnythingPlugin.cancelEdit();
        }
    },

    /**
     * Monitor scrolling and reposition the Floater if necessary
     */
    onScroll: function(e, target) {
        if (target.top !== this.knownScrollTop) {
            this.knownScrollTop = target.top;
        }
        if (target.left !== this.knownScrollLeft) {
            this.knownScrollLeft = target.left;
            this.doReposition();
        }
    },

    /**
     * Get or create (maintain) a Singleton reference to a set of control buttons
     */
    getOrCreateControlButtons: function() {
        // maintain a singleton reference to a set of control buttons
        if (!this.controlButtons) {
            this.controlButtons = new Ext.Container({
                // rounded corners around control buttons
                renderTpl: [
                    '<div class="{baseCls}-ml"></div>',
                    '<div class="{baseCls}-mr"></div>',
                    '<div class="{baseCls}-bl"></div>',
                    '<div class="{baseCls}-br"></div>',
                    '<div class="{baseCls}-bc"></div>',
                    '{%this.renderContainer(out,values)%}'
                ],
                // width from configuration
                width: this.controlButtonsWidth,
                renderTo: this.el,
                baseCls: Ext.baseCSSPrefix + 'grid-row-editor-buttons', // reuse the grid row editor button style
                // horizontal control button layout
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                // all buttons will be sized the same
                defaults: {
                    flex: 1,
                    margins: '0 1 0 1'
                },
                items: [
                // close button
                {
                    xtype: 'button',
                    scope: this.inlineAnythingPlugin,
                    handler: this.inlineAnythingPlugin.cancelEdit, // close the Floater
                    text: this.closeButtonText,
                    minWidth: Ext.panel.Panel.prototype.minButtonWidth
                }]
            });
        }
        return this.controlButtons;
    },

    /**
     * Get or create (maintain) a Singleton reference to a set of control buttons
     */
    createFloatHeader: function() {
        // destroy any existing floatHeader
        if (!this.floatHeader) {
            this.floatHeader = new Ext.Container({
                // rounded corners around control buttons
                renderTpl: [
                    '<div class="x-inlineanything-header-c"></div>',
                    '<div class="x-inlineanything-header-t"></div>',
                    '<div class="x-inlineanything-header-r"></div>',
                    '<div class="x-inlineanything-header-b"></div>',
                    '<div class="x-inlineanything-header-l"></div>',
                    '{%this.renderContainer(out,values)%}'
                ],
                // width from configuration
                width: 100,
                renderTo: this.el,
                baseCls: Ext.baseCSSPrefix + 'inlineanything-header', // reuse the grid row editor button style
                // horizontal control button layout
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                // all buttons will be sized the same
                defaults: {
                    flex: 1,
                    margins: '0 1 0 1'
                },
                items: [
                // close button
                //{
                //    xtype: 'button',
                //    scope: this.inlineAnythingPlugin,
                //    handler: this.inlineAnythingPlugin.cancelEdit, // close the Floater
                //    text: 'Header',
                //    minWidth: Ext.panel.Panel.prototype.minButtonWidth
                //}
                ]
            });
        }
        return this.floatHeader;
    },
    
    /**
     * Safely reposition the Floater
     */
    maybeReposition: function(c) {
        // check for self reference, don't reposition
        if (c && (c == this || !this.view.isDescendantOf(c))) {
            return;
        }
        // reposition if this Floater is visible
        if (this.isVisible() && this.view.isVisible(true)) {
            this.doReposition();    
        }
    },

    /**
     * Do actual visual/DOM repositioning work with animations etc
     */
    doReposition: function() {
        var me = this,
            row = this.context && Ext.get(this.context.row),
            btns = this.getOrCreateControlButtons(),
            header = this.createFloatHeader(),
            grid = this.inlineAnythingPlugin.grid,
            floaterWidth = grid.headerCt.getFullWidth(),
            btnsElLeftPosition = ((Math.min(grid.getWidth(), floaterWidth)) - btns.getWidth()) / 2 + grid.view.el.dom.scrollLeft;

        // defined anonymously here to obtain a scoped reference to btns and grid
        var anonymousInvalidateScrollbar = function() {
            btns.el.scrollIntoView(grid.view.el, false);
        };
       
        // position the Floater
        if (row && Ext.isElement(row.dom)) {
            // scroll into viewable area
            row.scrollIntoView(grid.view.el, false);
            
            var rowHeight = row.getHeight();
            var newHeight = rowHeight + (this.inlineAnythingPlugin.grid.rowLines ? 9 : 10);
            
            var floaterY = row.getXY()[1];  // obtain the target Y position this way so it works properly with various grid features, as opposed to offsetTop
            if (me.position == 'under') {
                 floaterY += rowHeight;
            }

            this.el.setLeft(0);
            
            var ani = {
                to: {
                    y: floaterY
                },
                duration: this.moveDuration,
                listeners: {
                    afteranimate: function() {
                        anonymousInvalidateScrollbar();
                        var newY = row.getXY()[1];  // obtain the target Y position this way so it works properly with various grid features, as opposed to offsetTop
                        if (me.position == 'under') {
                             newY += rowHeight;
                        }
                        
                        // fail safe in the event vertical height changed during animation
                        if (newY != floaterY) {
                          me.el.setLocation(me.el.getXY()[0], newY);
                        }
                    }
                }
            };
            this.el.animate(ani);
            
        }
        
        this.setWidth(floaterWidth);
        btns.el.setLeft(btnsElLeftPosition);
        
        console.log("x: " + this.lastColumn.x + ", width: " + this.lastColumn.el.dom.scrollWidth);
        
        header.el.setLeft(0 == this.lastColumn.x ? -1 : this.lastColumn.x);
        header.setWidth(this.lastColumn.el.dom.scrollWidth);
        
        header.el.setTop(-1 * header.el.dom.scrollHeight + 1);
    },

    /**
     * Override the default startEdit, nwo used to cleanup components and defer to createInlineComponent for creation
     */
    startEdit: function(record, column, inlineComponentFunc) {
      
        this.lastColumn = column;
      
        var grid = this.inlineAnythingPlugin.grid;
        
        // apply the correct contextual items (grid view and store)
        this.context = Ext.apply(this.inlineAnythingPlugin.context, {
            view: grid.getView(),
            store: grid.store
        });
        
        // remove all existing inlined components from previous Floater displays
        this.removeAll();

        // ensure record selection
        grid.getSelectionModel().select(record);
        
        // create inline component
        var inlineCmp = this.createInlineComponent(record, column, inlineComponentFunc);
        
        // add the inline component
        this.add(inlineCmp);

        if (!this.isVisible()) {
            // show Floater and set focus if needed
            this.show();
        } else {
            // set Floater position if its already shown
            this.doReposition();
        }
    },
    
    createInlineComponent: function(record, column, inlineComponentFunc) {
      return Ext.widget(inlineComponentFunc(record, column));
    },

    cancelEdit: function() {
        this.hide();
    },

    onShow: function() {
        this.callParent(arguments);
        this.doReposition();
    },

    onHide: function() {
        this.callParent(arguments);
        if (this.context) {
            this.context.view.focus();
            this.context = null;
        }
    },
    
    beforeDestroy: function() {
        Ext.destroy(this.controlButtons);
        this.callParent();    
    },

    removeField: function(field) {
        // override, do nothing
    },

    renderColumnData: function(field, record, activeColumn) {
        // override, do nothing
    },

    clearFields: function() {
        // override, do nothing
    }
});

