# Mossball

[Marimo][marimo] is a computational notebook
that lets data scientists mix code, discussion, and results.
Its plugin system relies on [AnyWidget][anywidget],
which specifies a simple contract between extensions and Marimo.
The aim of this project is to design, build, and test a set of Marimo plugins
for classroom exercises similar to those in [H5P][h5p]:
multiple choice, fill in the blanks, and so on.

## Demo
You can watch the demo video of explaining the overall design and structure of plugins
- YouTube: https://youtu.be/oeYEotXOvgA
- Google Drive: https://drive.google.com/file/d/1DYZI3w0ikATuKTXiATNHsOeLZL5uu5M_/view?usp=sharing

## Setup

1.  Clone [this repository][repo].

1.  Create and activate a Python virtual environment.
    -   E.g., if you are using [uv][uv], run `uv venv` and then `source .venv/bin/activate`.

1.  Install the package in `pyproject.toml` for development.
    -   E.g., run `uv pip install -e ".[dev]"`.

You may also want to clone the [Marimo repository][marimo-repo].

## Research and Possible Plugins

### Initial Feedback and General Findings

* Many professors and students preferred straightforward, simple, and common exercises like multiple choice, fill in the blank, and true or false
* Professors also found more unique widgets to be useful for the specific courses that they teach
    * For example, the professor who teaches a Machine Learning course shares their opinion that it would be useful to see widgets where students can interact with the data, such as drawing decision boundaries.
* Students overall chose more interactive and quick activities like Drag the Words or Sort the Paragraphs over ones that required more writing or detail like Essay
* Professors also chose interactive activities but recommended against gamification and relying on too many images

### Suggested H5P Plugins and Comparisons to Other Implementations

Below are a few of the H5P plugins suggested by professors and students, along with some differences noted between the H5P versions and those from other online learning platforms:

<table>

<!-- Cassandra -->
<tr>
<th>Widget</th>
<th>H5P Features</th>
<th>Other Implementations</th>
<th>Summary</th>
</tr>
<tr>
<td valign="top">Multiple Choice</td>
<td valign="top"><ul>
<li>When there is only one correct answer, the selection symbol is a radio button; when there are multiple correct answers, the symbol is a checkbox</li>
<li>Each choice is initially within a grey box </li>
<li>When you hover over a choice, the colour of the box changes to light grey</li>
<li>When you select the option, the colour of the box changes to blue, the radio button is filled in (or the checkbox is checkmarked), and the whole box becomes outlined with a thicker blue border which becomes thinner again once you click away</li>
</ul></td>
<td valign="top">Canvas<ul>
<li>All boxes are always white</li>
<li>When the option is selected, only the radio button is filled in</li>
</ul>
D2L
<ul>
<li>All boxes are initially white </li>
<li>When you hover over it, the box changes to grey, and the outline of the radio button / checkbox becomes thicker and changes from grey to blue</li>
<li>When you select an option, the box becomes blue and the button is filled in; the outline remains blue until you click away</li>
<li>The specific widgets for when there is a single correct answer versus multiple are separated as “Multiple Choice” and “Multi-Set”</li>
</ul></td>
<td valign="top"><ul>
<li>For quizzes, having the boxes and background as both white like Canvas is more consistent and less distracting</li>
<li>For small exercises in between a lecture or reading, giving the boxes a different colour like H5P can help the exercise to stand out from the rest of the page content; however, this might look awkward if the options span multiple lines or of varying sizes</li>
<li>Having the box change colour on hover and on click is useful, as makes it obvious to the student which option they selected</li>
<li>Multiple choice questions can be embedded within lessons to test students’ knowledge while learning; Single Choice Set / Question Set can be used at the end of a module/lesson to review and solidify their understanding</li>
</ul></td>
</tr>

<tr>
<td valign="top">Sort the paragraphs</td>
<td valign="top"><ul>
<li>Each step is in a separate box with arrows on the right to swap the current box with the one above/below</li>
<li>The box can also be dragged to the desired position and the rest of the boxes will be shifted accordingly</li>
<li>The step becomes blue once dragged and the box that it is held over gets a dotted border instead of a solid one</li>
<li>No clear drag and drop symbol or indication</li>
</ul></td>
<td valign="top">D2L Creator+ (extra D2L package)<ul>
<li>Also has the ability to drag the box similar to H5P, but has no arrows</li>
<li>To the left of the box containing the step is a segment containing an extra description (e.g., “Step 1”) and a drop down selection — students can select which step to place in the current box rather than dragging</li>
<li>The colour of the box remains white, but the position that the step will be placed in is outlined in a thick blue dotted border (not as obvious as H5P)</li>
<li>The draggable box contains a “drag dots” symbol</li>
</ul></td>
<td valign="top"><ul>
<li>The dropdown feature from D2L is more convenient and less tedious compared to the H5P version with arrows</li>
<li>The dropdown selection allows the widget to be used like a matching exercise instead of only a sorting activity</li>
<li>Having the entire box be highlighted in a different colour rather than just the border can be helpful for the student to clearly identify where they will be placing the step</li>
<li>The drag dots symbol is important to clearly indicate that the box can be dragged (with the H5P version, students may think that they can only use the arrows to reorder the steps)</li>
</ul></td>
</tr>

<!-- Rachel -->
<tr>
<td valign="top">Branching Scenario</td>
<td valign="top"><ul>
<li> Can embed video, as well as other components like image, course presentation, interactive video </li>
<li>On the top left corner, it shows the option that I selected in the previous question</li>
<li>Whenever I select not the best / incorrect answer, then it shows the popup to retry the question</li>
<li>On the top right corner, there is a “Proceed” button in which the user can skip the video and get the next question to answer</li>
</ul></td>
<td valign="top">Elucidat<ul>
<li>Mostly similar to H5P component</li>
<li>There is a navigation bar on the top right corner where you can check the list of contents</li>
<li>(At least for this demo), we can see the overview of selections in the end</li>
</ul></td>
<td valign="top"><ul>
<li>There’s no big difference between plugins between different platforms</li>
<li>H5P’s version supports an integration to various contents</li>
<li>Both plugins show a quick feedback upon the selection</li>
<li>Having “Proceed” or navigation button could make less boredom for users</li>
</ul></td>
</tr>
<tr>
<td valign="top">Chart</td>
<td valign="top"><ul>
<li>There’s a limitation of supporting only two types of charts: bar and pie chart</li>
<li>Each element in the chart is not interactive, i.e. when hovering over the element, there is no popup</li>
<li>For implementation aspect, user can add label and value to each data element, select background/font color for each data element</li>
<li>But it requires to input data manually</li>
</ul></td>
<td valign="top">JSXGraph (Moodle’s plugin)<ul>
<li>There are interactive tools that can manipulate the bars in the chart, move around the graph</li>
<li>They have more chart types than H5P charts - Line, Spline, Multiple, Horizontal, Regression, etc.</li>
<li>Except for dynamic data chart, a user can only hover the data elements in the context of interaction</li>

</ul></td>
<td valign="top"><ul>
<li>The chart widget from H5P is more for representation than interaction</li>
<li>There are only two chart types supported in H5P while Moodle’s JSXGraph supports a variety of charts</li>
</ul></td>
</tr>


<!-- Evence -->
<tr>
<td valign="top">Course Presentation</td>
<td valign="top"><ul>
<li>Allows creating slideshows with minor customizations</li>
<li>Ability to embed interactive modules such as quizzes, videos, pop-ups in simple drag-and-drop format</li>
<li>Navigation control for jumping and restricting slides; support for branching paths</li>
<li>Easy and intuitive interface</li>
</ul></td>
<td valign="top">reveal.js (Moodle plugin)<ul>
<li>Requires HTML or Markdown for slide creation</li>
<li>Minimal ability for interactivity unless custom code is added</li>
<li>Supports vertical transitions on top of traditional horizontal transition, allows for in depth context addition and clearer branching logic</li>
<li>Would be extremely difficult to use for users without prior coding background</li>
</ul></td>
<td valign="top"><ul>
<li>H5P is easy to use and great for building interactive presentations without the need for complex logic or coding knowledge</li>
<li>reveal.js allows for more customization but is more suitable for those comfortable with coding</li>
<li>H5P has limited granularity for feedback and lacks advanced customization</li>
</ul></td>
</tr>
<tr>
<td valign="top">Interactive Video</td>
<td valign="top"><ul>
<li>Embed modules at specific timestamps</li>
<li>Auto-pause, navigation control (guiding based on quiz answer)</li>
<li>Bookmark support for quick jumps</li>
<li>Reusable across all platforms that supports H5P</li>
</ul></td>
<td valign="top"><ul>
<li>Platforms like Udemy, Coursera, etc. provide exercises paired with video content as well but lack true interactivity integration like H5P did with the video plugin</li>
</ul></td>
<td valign="top"><ul>
<li>H5P provides interactive learning features such as other H5P plugins, which offers the users a great ecosystem</li>
<li>H5P offers no video manipulation features, requiring the use of pre-edited videos</li>
<li>Again H5P lacks granularity for feedback and lacks advanced customization capabilities, so educators could possibility lose out on important insights</li>
</ul></td>
</tr>

<!-- Lorena -->
<tr>
<td valign="top">Fill in the blanks</td>
<td valign="top"><ul>
<li>Users can type their answers into the blanks</li>
<li>It can be set to auto-check each response or check after all the blanks are filled</li>
<li>Score is shown at the end and the user can reveal the solutions</li>
<li>Multimedia support, can add an image or video</li>
<li>Functionality to show hint tooltips to the user</li>
<li>Can be used in conjunction with other H5P content types: ex: fill in the blanks pop-up within a video (interactive video)</li>
<li>There is a complex fill in the blanks content type that has advanced feedback and dropdown options</li>
</ul></td>
<td valign="top">Canvas:<ul>
<li>No auto-check option: answers are only shown at the end of the quiz</li>
<li>No hint tooltip functionality</li>
</ul>
Blackboard Learn:
<ul>
<li>Very similar to Canvas</li>
<li>Supports regular expressions for answer matching</li>
<li>Partial credit scoring option</li>
</ul>
</ul></td>
<td valign="top"><ul>
<li>A student mentioned that fill in the blanks exercises aren’t usually stimulating due to lack of visual elements, this H5P content type can be combined with other types to create a more visually engaging experience.</li>
<li>H5P has more features than what is seen on other platforms, but is missing partial credit scoring and regex support.</li>
</ul></td>
</tr>
<tr>
<td valign="top">Drag the words</td>
<td valign="top"><ul>
<li>User can drag words to fill in the blanks</li>
<li>Can show hint tooltips to the user</li>
<li>No rich text support</li>
<li>Instant feedback option available</li>
<li>Score with detailed feedback shown on submission</li>
<li>For dragging words onto images: can use the drag and drop content type</li>
</ul></td>
<td valign="top">Blackboard Learn<ul>
    <li>They don’t have a drag the words implementation, but they have picking the matching word from a dropdown</li>
    <li>Multimedia support, can match pictures to words</li>
    <li>Rich text support</li>
  </ul>
Moodle
  <ul>
    <li>Similar to H5P, but with rich text support and partial grading</li>
    <li>Drag and drop onto image content type also available</li>
  </ul>
</ul></td>
<td valign="top"><ul>
<li>H5P drag the words/drag and drop cover most functionality except for rich text support and partial scoring which are included in the Moodle implementation</li>
</ul></td>
</tr>

<!-- David -->
<tr>
<td valign="top">Interactive Book</td>
<td valign="top"><ul>
<li> Embedded course presentation slides within the interactive book. </li>
<li> Quiz types include multiple-choice, drag-and-drop words, drag-and-drop images, and fill-in-the-blanks. </li>
<li> Instant grading for quizzes, with results shown and retry options available. </li>
<li> Unique URLs for each page, allowing direct links to specific sections. </li>
<li> Embedded YouTube videos for multimedia content. </li>
</ul></td>
<td valign="top">Genially<ul>
<li> Embedding of content types such as maps, social networks, music, videos, and audio. </li>
<li> Quizzes included in interactive books. Tools for creating graphics, charts, tables, and timelines. </li>
<li> On-click interactive elements like lists, tables, timelines and dropdowns. </li>
<li> Does not support drag-and-drop interactions. </li>
<li> Does not provide unique URLs for individual pages. </li>
</ul></td>
<td valign="top"><ul>
<li> H5P offers more quiz types, instant grading, and retry options, while Genially’s quizzes are simpler and lack these features. </li>
<li> Genially offers more multimedia embedding, while H5P is just interactive videos. </li>
<li> H5P includes drag-and-drop features, while Genially offers on-click elements like dropdowns and expandable lists. </li>
<li> Both H5P and Genially have similar interactive options, but Genially offers more tools for creating content like charts, timelines and graphs. </li>
</ul></td>
</tr>
<tr>
<td valign="top">Structure Strip</td>
<td valign="top"><ul>
<li> Includes information popups that explain each section, helping users understand what to do in each part of the structure strip. </li>
<li> Allows users to instantly check their answers and provides feedback specific to their responses for each row. </li>
<li> Enables users to copy their answers to the clipboard to save their work. </li>
</ul></td>
<td valign="top">Canvas<ul>
<li> Includes a grading scheme for the assignment and individual sections. </li>
<li> Allows modifications to row names and section details. </li>
<li> Saves grades from the rubric for students. </li>
<li> Enables editing of the title, sections, descriptions, and points for each row. </li>
<li> Calculates the total grade by summing the points for each section. </li>
</ul></td>
<td valign="top"><ul>
<li> H5P’s instant feedback is helpful, but adding a grading system (points per row) like Canvas rubrics would improve assessment. </li>
<li> H5P doesn’t allow editing row titles or number of rows, unlike Canvas rubrics, limiting customization. </li>
<li> H5P only supports clipboard copying, but adding a PDF export option would improve usability. </li>
<li> A rich text editor with formatting (e.g., bullet points, word count) in H5P would help users better structure their answers. </li>
</ul></td>
</tr>
</table>

### Other recommended widgets:
* Quiz (Question Set)
    * Useful in between lessons or at the end of modules to reinforce students’ understanding with different types of questions available (multiple choice, fill in the blanks, drag the words, etc.)
* Cornell Notes
    * Useful for taking notes while watching a video or reading
* Dialog Cards
    * Useful for students to do a quick self-check of whether they understood the material
    * Similar to many students’ studying methods
* True/False
    * Useful to test students’ knowledge, similar to Multiple Choice


[anywidget]: https://anywidget.dev/
[h5p]: https://h5p.org/content-types-and-applications
[marimo]: https://marimo.io/
[marimo-repo]: https://github.com/marimo-team/marimo
[repo]: https://github.com/gvwilson/mossball
[uv]: https://docs.astral.sh/uv/
