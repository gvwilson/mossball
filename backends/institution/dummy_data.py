# Dummy data for the sort paragraphs plugin
sort_paragraphs_data = {
    "1": {
        "question": "Arrange the following steps of the water cycle:",
        "texts": [
            "Water evaporates from the surface.",
            "Water vapor condenses to form clouds.",
            "Precipitation occurs as rain or snow.",
            "Water collects in bodies of water."
        ],
    },
    "2": {
        "question": "Order the steps for problem solving:",
        "texts": [
            "Understand the problem",
            "Make a plan",
            "Carry out the plan",
            "Look back and reflect"
        ],
    }
}

# Dummy data for the multiple choice plugin
mc_data = {
    "3": {
        "question": "What is the capital city of Ontario?",
        "options": ["Ottawa", "Toronto", "Vancouver", "Montreal"],
        "answer": 1
    }
}


structure_strip_data = {
    "4": {
        "title": "London Docklands Evaluation",
        "description": "Make yourself familiar with the Docklands in London that underwent major changes. To what extend was the Docklands Regeneration successful? Your evaluation of the successes and the failures each should be roughly three times the size of your introduction and your conclusion.",
        "sections": [
            {
                "id": "introduction",
                "label": "Introduction",
                "prompt": "Describe how the London Docklands has changed and why. Where is the London Docklands? What was the function before 1980? What happened after 1980?",
                "rows": 6,
                "max_length": 200
            },
            {
                "id": "body1",
                "label": "Successes",
                "prompt": "What were the successes of the change in function? How was the regeneration successful for the people? What were the successes of the change in land use? Keywords that you should include: hospitals, schools, facilities, infrastructure, inner city, and community. Remember to include facts and statistics to support your points.",
                "rows": 6,
                "max_length": 600
            },
            {
                "id": "body2",
                "label": "Failures",
                "prompt": "What were the failures in the change in function? How was the regeneration a failure for the people? What were the failures of the change in land use? Keywords that you should include: hospitals, schools, facilities, infrastructure, inner city, and community. Remember to include facts and statistics to support your points.",
                "rows": 6,
                "max_length": 600
            },
            {
                "id": "conclusion",
                "label": "Conclusion",
                "prompt": "Summarise the overall successes of the regeneration. Summarise the overall failures of the regeneration. To what extend was the regeneration a success overall? Use specific evidence to support your points.",
                "rows": 6,
                "max_length": 200
            }
        ]
    }
}

drag_the_words_data = {
        "instruction": "Drag the words to the correct positions",
        "question": "In a multitasking operating system, {{processes}} share the CPU by using {{scheduling algorithms}} such as Round Robin and First Come, First Served. The OS also manages {{memory allocation}}, ensuring that each process has access to the necessary {{resources}}. To prevent {{deadlocks}}, it employs techniques like resource ordering and {{preemption}}."
    }

student_data = {
    "1": {},
    "2": {},
    "3": {},
    "4": {},
    "5": {}
}