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
<li> *H5P LIST* </li>
</ul></td>
<td valign="top">*OTHER PLATFORM*<ul>
<li>*OTHER PLATFORM LIST*</li>
</ul></td>
<td valign="top"><ul>
<li>*SUMMARY LIST*</li>
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
