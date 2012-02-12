ApplicationCommand = soma.Command.extend({
	execute: function(event) {
		switch(event.type) {
			case ApplicationEvent.SETUP:
				this.getWire(ApplicationWire.NAME).setup();
				this.getWire(NavigationWire.NAME).setup();
				break;
			case ApplicationEvent.CLEANUP:
				// cleanup application created using codemirror
				for (var i=window.listApp.length-1; i>=0; --i) {
					if (window.listApp[i] instanceof soma.Application) {
						window.listApp[i].dispose();
						window.listApp.splice(i, 1);
					}
				}
				break;
		}
	}
});

NavigationCommand = soma.Command.extend({
	execute: function(event) {
		switch(event.type) {
			case NavigationEvent.SELECT:
				this.getWire(ApplicationWire.NAME).select(event.params.navigationId);
				this.getWire(NavigationWire.NAME).select(event.params.navigationId);
				break;
			case NavigationEvent.SELECT_TUTORIAL:
				this.getWire(ApplicationWire.NAME).select(NavigationConstants.TUTORIAL);
				this.getWire(NavigationWire.NAME).selectTutorial(event.params.navigationId);
				this.dispatchEvent(new ChapterEvent(ChapterEvent.ACTIVATE, event.params.navigationId));
				break;
			}
		this.dispatchEvent(new NavigationEvent(NavigationEvent.SELECTED, event.params.navigationId));
	}
});

ChapterCommand = soma.Command.extend({
	execute: function(event) {
		switch(event.type) {
			case ChapterEvent.PREVIOUS:
				this.getWire(event.params.chapterId).previous();
				break;
			case ChapterEvent.NEXT:
				this.getWire(event.params.chapterId).next();
				break;
			case ChapterEvent.ACTIVATE:
				this.getWire(event.params.chapterId).activate();
				break;
		}
	}
});

ExerciseCommand = soma.Command.extend({
	execute: function(event) {
		switch(event.type) {
			case ExerciseEvent.RECORD:
				this.getModel(event.params.chapterId).record(event.params.code);
				break;
		}
	}
});
