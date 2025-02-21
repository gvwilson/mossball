import marimo

__generated_with = "0.11.7"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    from SortTheParagraphs import SortTheParagraphs

    question = "Order the steps for problem solving."
    texts = ["Understand the problem", "Make a plan", "Carry out the plan", "Look back and reflect"]

    SortTheParagraphs(question=question, sorted_texts=texts)
    return SortTheParagraphs, mo, question, texts


@app.cell
def _(SortTheParagraphs):
    # Testing longer texts from https://www.freedrinkingwater.com/blogs/news/resource-water-cycle-student-guide
    question2 = "Order the steps for problem solving."
    t1 = """
    Evaporation: The first of the water cycle steps begins with evaporation. It is a process where water at the surface turns into water vapors. Water absorbs heat energy from the sun and turns into vapors. Water bodies like oceans, seas, lakes and rivers are the main source of evaporation. Through evaporation, water moves from hydrosphere to atmosphere. As water evaporates it reduces the temperature of those water bodies.
    """
    t2 = """
    Condensation: As water vaporizes into water vapor, it rises up in the atmosphere.
    """
    t3 = """
    Sublimation: Apart from evaporation, sublimation also contributes to water vapors in the air. Sublimation is a process where ice directly converts into water vapors without converting into liquid water. This phenomenon accelerates when the temperature is low or pressure is high. The main sources of water from sublimation are the ice sheets of the North Pole and the South Pole and the ice caps on the mountains. Sublimation is a rather slower process than evaporation.
    """
    t4 = """
    Precipitation: The clouds (condensed water vapors) then pour down as precipitation due to wind or temperature change. This occurs because the water droplets combine to make bigger droplets, so when the air cannot hold any more water, it precipitates. At high altitudes the temperature is low and hence the droplets lose their heat energy. These water droplets fall down as rain. If the temperature is very low (below 0 degrees), then the water droplets would fall as snow. In addition, water could also precipice in the form of drizzle, sleet and hail. Hence water enters lithosphere by landing upon the earth.
    """
    t5 = """
    Transpiration: As water precipitates, some of it is absorbed by the soil. This water enters into the process of transpiration. Transpiration is a process similar to evaporation where liquid water is turned into water vapor by the plants. The roots of the plants absorb the water and push it toward leaves where it is used for photosynthesis. The extra water is moved out of leaves through stomata (very tiny openings on leaves) as water vapor. Thus water enters the biosphere (plants and animals) and exits into a gaseous phase.
    """
    t6 = """
    Runoff: As the water pours down (in whatever form), it leads to runoff. Runoff is the process where water runs over the surface of earth. When the snow melts into water it also leads to runoff.
    """
    t7 = """
    Infiltration: Any water that doesn't run directly to bodies of water or get quickly evaporated, will be absorbed by plants and soil, where it may be driven deeper to the earth. This is called infiltration. The water seeps down and increases the level of the ground water table. Underground water tables typically provide pure clean water that is safe to drink. The infiltration is measured as inches of water-soaked by the soil per hour.
    """
    texts2 = [t1, t2, t3, t4, t5, t6, t7]

    SortTheParagraphs(question=question2, sorted_texts=texts2)
    return question2, t1, t2, t3, t4, t5, t6, t7, texts2


if __name__ == "__main__":
    app.run()
