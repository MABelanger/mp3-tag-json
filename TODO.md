Idea :

- When i open the app, ask question buttons "create new" "continue" or "open" "set"

If it create or continue :

- It will generate all the found \*.mp3 path in file => all_found_mp3.lst

# structure of set.json

```json
{
  "keeps": [],
  "lefts": [],
  "unknows": []
}
```

# If create new set

it will create a new set with
it will ask question for each mp3 found in the directory
For each mp3 it will ask keep or left.
If keep add to the array keeps (name + md5sum)
if it left add to the array lefts (name + md5sum)

# if it continue set

it will compare

At any time it can save into set.json

All in frontend (search + tag)

- Create a single html with vite (css + js)
- Create the find all mp3 in drag & drop folder.
- generate all the found \*.mp3 path in file => all_found_mp3.lst
- generate all the already tagged \*.mp3 path + md5 into => all_already_tagged_mp3.json
- remove the file in all_found_mp3.lst that is in all_already_tagged_mp3.json or keeps_lefts.json save it to =>

- For all genereted path :
  - calc the md5sum Check if the file is already in the list keeps_lefts.json or
    - play the file and keep or left.
      - If keep, save into keeps [] array json + md5sum
      - If left, save into lefts [] array json + md5sum
