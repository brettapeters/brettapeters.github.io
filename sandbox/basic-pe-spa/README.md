# History API Page Transitions

Idea: each list item, when clicked triggers a transition to a full screen slide that is effectively a "show" page for that list item. The transition is the rectangle of the list item scaling up to fill the viewport. Using the history API, each item's slide page will have a unique url. If the show page was accessed via a click on a list item, when the browser navigates back to the list, the transition will play in reverse, making it seem like the slide is shrinking back to the list item's size. If the list is accessed directly, no transition will play. 
