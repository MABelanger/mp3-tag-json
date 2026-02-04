import sys
import json
import sys

# Simple Q&A Script asked via the stderr

def input_stderr(prompt):
    sys.stderr.write(prompt)
    sys.stderr.flush() # Ensure the prompt is displayed immediately
    return sys.stdin.readline().strip()

track_questions_dict = {
    "instrumentOrTypes": "instrument/type separed by , :",
    "expention": "introspection(0) -> expention(10):",
    "festive": "sad(0) -> festif(10):",
    "contact": "solo(0) -> contact(10):",
    "rythmic": "classic(0) -> rythmic(10):",
    "bass": "high(0) -> bass(10):",
    "curve": "start(0) -> top(5) -> end(10):",
    "note": "notes:"
}

def check_nb_argv():
    if len(sys.argv) != 5:
        print("Usage: python3 tag_track.py <mp3RelativePath> <md5sum> <duration> <bpm>")
        sys.exit()

check_nb_argv()

def get_init_track_answer_dict():
    track_answers_dict = {}
    track_answers_dict["mp3RelativePath"] = sys.argv[1]
    track_answers_dict["md5sum"] = sys.argv[2]
    track_answers_dict["duration"] = sys.argv[3]
    track_answers_dict["bpm"] = sys.argv[4]
    return track_answers_dict

track_answers_dict = get_init_track_answer_dict()

for key in track_questions_dict:
    track_answers_dict[key] = input_stderr(track_questions_dict[key])


track_answers_json = json.dumps(track_answers_dict, indent=2)

# print all answer in the json format
print(track_answers_json)

