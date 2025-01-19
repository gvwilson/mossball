# Mossball

[Marimo][marimo] is a computational notebook
that lets data scientists mix code, discussion, and results.
Its plugin system relies on [AnyWidget][anywidget],
which specifies a simple contract between extensions and Marimo.
The aim of this project is to design, build, and test a set of Marimo plugins
for classroom exercises similar to those in [H5P][h5p]:
multiple choice, fill in the blanks, and so on.

## Setup

1.  Clone [this repository][repo].

1.  Create and activate a Python virtual environment.
    -   E.g., if you are using [uv][uv], run `uv venv` and then `source .venv/bin/activate`.

1.  Install the dependencies in `pyproject.toml`.
    -   E.g., run `uv pip install -r pyproject.toml`.

You may also want to clone the [Marimo repository][marimo-repo].

## Research and Possible Plugins

### Initial Feedback and General Findings

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
<li>The position that the selected step will be placed in is highlighted in a blue colour, making it clear and obvious where it will end up after dragging</li>
<li>No clear drag and drop symbol or indication </li>
<li>On hover, the cursor changes to the “move” cursor; while dragging, it becomes the “drop” cursor</li>
</ul></td>
<td valign="top">D2L Creator+ (extra D2L package)<ul>
<li>Also has the ability to drag the box similar to H5P, but has no arrows</li>
<li>To the left of the box containing the step is a segment containing an extra description (e.g., “Step 1”) and a drop down selection — students can select which step to place in the current box rather than dragging</li>
<li>The colour of the box remains white even while dragging, but the position that the step will be placed in is outlined in a blue dotted border (not as obvious as H5P)</li>
<li>The draggable box contains a “drag dots” symbol, clearly indicating that the step can be moved </li>
<li>On hover, the cursor changes to the “grab” cursor; while dragging, it becomes the “drop” cursor</li>
</ul></td>
<td valign="top"><ul>
<li>The dropdown feature of D2L’s widget is overall more convenient and less tedious compared to the H5P version with arrows</li>
<li>The dropdown selection also allows the widget to be used like a matching exercise instead of only a sorting activity</li>
<li>Having the entire box be highlighted in a different colour rather than just the border can be helpful for the student to clearly identify where they will be placing the step</li>
<li>The drag dots symbol is important to clearly indicate that the box can be dragged (with the H5P version, students may think that they can only use the arrows to reorder the steps)</li>
<li>The cursor changing on hover and while moving is important to indicate that the box can dragged and dropped</li>
</ul></td>
</tr>

<!-- Rachel -->
<tr>
<td valign="top">Branching Scenario</td>
<td valign="top"><ul>
<li> *H5P LIST* </li>
</ul></td>
<td valign="top">*OTHER PLATFORM*<ul>
<li>*OTHER PLATFORM LIST*</li>
</ul></td>
<td valign="top"><ul>
<li>*SUMMARY LIST*</li>
</ul></td>
</tr>
<tr>
<td valign="top">Chart</td>
<td valign="top"><ul>
<li> *H5P LIST* </li>
</ul></td>
<td valign="top">*OTHER PLATFORM*<ul>
<li>*OTHER PLATFORM LIST*</li>
</ul></td>
<td valign="top"><ul>
<li>*SUMMARY LIST*</li>
</ul></td>
</tr>


<!-- Evence -->
<tr>
<td valign="top">Course Presentation</td>
<td valign="top"><ul>
<li> *H5P LIST* </li>
</ul></td>
<td valign="top">*OTHER PLATFORM*<ul>
<li>*OTHER PLATFORM LIST*</li>
</ul></td>
<td valign="top"><ul>
<li>*SUMMARY LIST*</li>
</ul></td>
</tr>
<tr>
<td valign="top">Interactive Video</td>
<td valign="top"><ul>
<li> *H5P LIST* </li>
</ul></td>
<td valign="top">*OTHER PLATFORM*<ul>
<li>*OTHER PLATFORM LIST*</li>
</ul></td>
<td valign="top"><ul>
<li>*SUMMARY LIST*</li>
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
<td valign="top">
Canvas:
<ul>
<li>No auto-check option: answers are only shown at the end of the quiz</li>
<li>No hint tooltip functionality</li>
<ul/>  
Blackboard Learn:
<ul>
<li>Very similar to Canvas</li>
<li>Supports regular expressions for answer matching</li>
<li>Partial credit scoring option</li>
</ul></td>
<td valign="top"><ul>
<li>A student mentioned that fill in the blanks exercises aren’t usually stimulating due to lack of visual elements, this H5P content type can be combined with other types to create a more visually engaging experience.</li>
<li>H5P has more features than what is seen on other platforms, but is missing partial credit scoring and regex support.</li>
</ul></td>
</tr>
<tr>
<td valign="top">Drag the words</td>
<td valign="top"><ul>
<li> *H5P LIST* </li>
</ul></td>
<td valign="top">*OTHER PLATFORM*<ul>
<li>*OTHER PLATFORM LIST*</li>
</ul></td>
<td valign="top"><ul>
<li>*SUMMARY LIST*</li>
</ul></td>
</tr>

<!-- David -->
<tr>
<td valign="top">Interactive Book</td>
<td valign="top"><ul>
<li> *H5P LIST* </li>
</ul></td>
<td valign="top">*OTHER PLATFORM*<ul>
<li>*OTHER PLATFORM LIST*</li>
</ul></td>
<td valign="top"><ul>
<li>*SUMMARY LIST*</li>
</ul></td>
</tr>
<tr>
<td valign="top">Structure Strip</td>
<td valign="top"><ul>
<li> *H5P LIST* </li>
</ul></td>
<td valign="top">*OTHER PLATFORM*<ul>
<li>*OTHER PLATFORM LIST*</li>
</ul></td>
<td valign="top"><ul>
<li>*SUMMARY LIST*</li>
</ul></td>
</tr>
</table>


[anywidget]: https://anywidget.dev/
[h5p]: https://h5p.org/content-types-and-applications
[marimo]: https://marimo.io/
[marimo-repo]: https://github.com/marimo-team/marimo
[repo]: https://github.com/gvwilson/mossball
[uv]: https://docs.astral.sh/uv/
