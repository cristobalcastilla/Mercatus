

var ListModel = Backbone.Model.extend({
  defaults: {
    name: undefined,
    slug: undefined, 

    items: new ListItemsCollection(),
    users: new UsersCollection(),

    created: moment(),
    modified: undefined  
  }
});