# plugin_types.py
from enum import Enum


class PLUGIN_TYPES(Enum):
    SORT_PARAGRAPHS = "sort_paragraphs"
    MULTIPLE_CHOICE = "multiple_choice"
    STRUCTRUE_STRIP = "structure_strip"
    DRAG_WORDS = "drag_words"
    FIND_WORDS = "find_words"
