var NotesApp = (function() {

  var App = {
    stores:{},
    views:{},
    collections:{}
  }
  //initialize localstorage data store
  App.stores.notes = new Store('notes');

  //note Model
  var Note = Backbone.Model.extend({
    localStorage : App.stores.notes,
    initialize: function(){
      if(!this.get('title')){
        this.set({title: "Note @ "+Date()})
      };
      if(!this.get('body')){
        this.set({body: "No content"})
      };
    }
  });

  var NoteList = Backbone.Collection.extend({
    // This collection is composed of Note objects
    model: Note,
    
    // Set the localStorage datastore
    localStorage: App.stores.notes,
    
    initialize: function(){
      var collection = this;
      
      // When localStorage updates, fetch data from the store
      this.localStorage.bind('update', function(){
        collection.fetch();
      })
    }
    
  })

  //views
  var newFormView = Backbone.View.extend({
    events: {
      "submit form":"createNote"
    },
    createNote: function(e){
      var attrs = this.getAttributes(),
          note = new Note();

      note.set(attrs);
      note.save();

      //stop browser for actually submiting the form
      e.preventDefault();
      //stop jquery mobile to doing this form from magic
      e.stopPropagation();

      //close

      $('.ui-dialog').dialog('close');
      this.reset();
    },

    getAttributes: function(){
      return {
        title: this.$('form [name=title]').val(),
        body: this.$('form [name=body]').val()
      }
    },
    reset: function(){
      //reset the form any input any textarea will be reset 
      this.$('input, textarea').val('');
    }
  });

  var noteListView = Backbone.View.extend({
    
    initialize: function(){
      _.bindAll(this, 'addOne', 'addAll');
      
      this.collection.bind('add', this.addOne);
      this.collection.bind('refresh', this.addAll);
      
      this.collection.fetch();
    },
    
    addOne: function(note){
      var view = new noteListItemView({model: note});
      $(this.el).append(view.render().el);
    },
    
    addAll: function(){
      $(this.el).empty();
      this.collection.each(this.addOne);
    }
    
    
  });

  var noteListItemView = Backbone.View.extend({
    tagName: 'LI',
    template: _.template($('#note-list-item-template').html()),
    
    initialize: function(){
      _.bindAll(this, 'render')
      
      this.model.bind('change', this.render)
    },
    
    render: function(){
      $(this.el).html(this.template({ note: this.model }))
      return this;
    }
    
  })

  window.Note = Note;


  App.views.new_form = new newFormView({
    el: $('#new')
  });

   App.collections.all_notes = new NoteList();

  App.views.list_alphabetics = new noteListView({
    el: $('#all_notes'),
    collection: App.collections.all_notes
  });
  
  
  return App;
})()