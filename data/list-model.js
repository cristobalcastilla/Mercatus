

var ListModel = Backbone.Model.extend({
  defaults: {
    name: undefined,
    slug: undefined, 

    items: undefined, // ListItemsCollection(),
    users: undefined, // UsersCollection(),

    created: moment(),
    modified: undefined  
  }
});