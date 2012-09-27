/**
 * @author Alex Sherwin
 * @license Apache 2.0
 */

Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath('Four59Cool.ux', 'ux');

Ext.require(['Ext.data.*', 'Ext.grid.*', 'Ext.tree.*', 'Four59Cool.ux.InlineAnything']);

Ext.onReady(function () {

    Ext.define('TreeGridPerson', {
        extend: 'Ext.data.Model',
        fields: ['name', 'email', 'address', 'city', 'state', 'country', 'phone', 'region']
    });

    var store = Ext.create('Ext.data.TreeStore', {
        model: 'TreeGridPerson',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'data/tree.json',
            reader: {
                type: 'json'
            }
        }
    });

    // create the grid
    var grid = Ext.create('Ext.tree.Panel', {

        store: store,
        
        viewConfig: {
            rootVisible: false
        },

        columns: [
                {
                    xtype: 'treecolumn',
                    width: 100,
                    dataIndex: 'region',
                    text: 'Region'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'name',
                    flex: 1,
                    text: 'Name'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'email',
                    flex: 1,
                    text: 'Email'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'city',
                    flex: 1,
                    text: 'City'
                },
                {
                    xtype: 'gridcolumn',
                    width: 75,
                    dataIndex: 'state',
                    text: 'State'
                },
                {
                    xtype: 'gridcolumn',
                    width: 100,
                    dataIndex: 'phone',
                    text: 'Phone'
                }
            ],

        renderTo: 'x-treegrid',
        width: 750,
        height: 400,

        plugins: [{

            ptype: 'inlineanything',

            inlineChecks: {

                state: function (ctx) {
                    return ctx.value != 'AK';
                },
                
                region: function(ctx) {
                    return false;
                },

                phone: function (ctx) {
                    return false;
                },

                default: function (ctx) {
                    return true;
                }

            },

            inlineConfigs: {
              
                state: function(record, column) {
                    return {
                        xtype: 'container',
                        height: 100,
                        layout: 'vbox',
                        style: {
                            padding: '10px'
                        },
                        items: [{
                            xtype: 'button',
                            text: 'Do something with State'
                        }]
                      
                    };
                },

                default: function(record, column) {

                    return {

                        xtype: 'container',

                        layout: {
                          
                            type: 'vbox',
                            padding: '10 10 0 10',
                            defaultMargins: {
                                bottom: 10
                            }
                        },

                        items: [{
                            xtype: 'label',
                            text: 'Name: ' + record.data.name
                        }, {

                            xtype: 'label',
                            text: 'Email: ' + record.data.email
                        }, {

                            xtype: 'label',
                            text: 'Phone: ' + record.data.phone
                        }, {

                            xtype: 'label',
                            text: 'City: ' + record.data.city
                        }, {

                            xtype: 'label',
                            text: 'State: ' + record.data.state
                        }, {

                            xtype: 'label',
                            text: 'Country: ' + record.data.country
                        }, {

                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                defaultMargins: {
                                    right: 5
                                }
                            },
                            items: [{
                                xtype: 'button',
                                text: 'Do Something'
                            }, {
                                xtype: 'button',
                                text: 'Do Something Else'
                            }]
                        }]

                    };
                }
            }
        }]

    });

});
