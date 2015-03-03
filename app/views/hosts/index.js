/**
 * Ember view for hosts index.
 */
import Ember from "ember";

export default Ember.View.extend({

    didInsertElement: function () {
        Ember.$("#mainContainer").removeClass( "container" ).addClass( "container-fluid" );
        this.resizeElements();
        Ember.$(window).on("resize", this.resizeElements);
        this.controller.get('mapLayer').invalidateSize();

    },

    resizeElements: function() {
        if (Ember.$(".leaflet-container")) {
            Ember.$(".leaflet-container").height(Ember.$(window).height() - Ember.$("nav .container").height() - 20);
        }

        if (Ember.$("#resultList")) {
            Ember.$("#resultList").height(Ember.$(window).height() - Ember.$("nav .container").height() - Ember.$("div.search-box").height() - 20);
        }
    }
});
