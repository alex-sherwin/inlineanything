Ext.define('MyApp.view.override.TreeGrid', {
    override: 'MyApp.view.TreeGrid',
    
    plugins: [{
        ptype: 'inlineanything',
        
        floaterConfig: {
            //moveDuration: 90,
            //position: 'under'
        },
        
        inlineChecks: {
            
            default: function(ctx) {
              return true;
            },
            
            age: function(ctx) {
              return ctx.record.data.age > 18;
            }
            
        },

        inlineConfigs: {

            default: function (record, column) {

                return {

                    // needs alias or xclass
                    xtype: 'container',

                    height: 75,

                    layout: 'hbox',

                    items: [{

                        xtype: 'label',
                        text: 'name: ' + record.data.name
                    }]

                };
            },

            state: function (record, column) {

                return {

                    // needs alias or xclass
                    xtype: 'container',

                    height: 75,
                    
                    layout: 'fit',

                    items: [{
                        
                        xtype: 'container',
                        
                        layout: { type: 'hbox', align: 'stretch' },
                        
                        items: [{

                            xtype: 'button',
                            text: 'age: ' + record.data.age,
                            flex: 1
                        }, {

                            xtype: 'button',
                            text: 'age: ' + record.data.age,
                            flex: 2
                        }]
                        
                    }]

                };
            }
        }
        
        
    }]
    
});