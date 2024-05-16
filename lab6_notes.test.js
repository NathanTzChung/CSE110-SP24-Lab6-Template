describe('Tests for note taker app', () => {
    beforeAll(async () => {
        await page.goto('http://127.0.0.1:5500/');
      }, 20000);


    it('Clicking Add Note to add a note', async () => {
        let addedNote = false;
        // Sticky notes before clicking add note
        const localData = await page.evaluate(() => {
            return localStorage.getItem('stickynotes-notes');  
        });

        // console.log('This is localData before click: ' + localData);

        const firstClick = await page.$('.add-note');
        await firstClick.click();

        // Sticky notes after clicking add note
        const localDataNew = await page.evaluate(() => {
            return localStorage.getItem('stickynotes-notes');  
        });
        // console.log('This is localData after click: ' + localDataNew);
        if(localDataNew != '[]'){
            addedNote = true;
        }

        expect(addedNote).toBe(true);
    });

    it('Edit a new note and remains after clicking outside note OR pressing tab', async () => {
        // From previous test, a new note was added
        const newNote = await page.$('.note');
        await newNote.click();

        const noteValue = await newNote.getProperty('value');
        const jsonNoteValue = await noteValue.jsonValue();
        let bool = false;                                       // to check that the note was edited

        // Check to make sure there is nothing in the note
        if(jsonNoteValue == ''){
            // Edit the note and tab away
            // await page.$eval('.note', e => e.value = 'Edited note');
            await newNote.type('Edited note');
            await page.keyboard.press('Tab');

            // Click back into the note
            await newNote.click();
            bool = true;
        };

        const editedValue = await newNote.getProperty('value');
        const jsonEditedValue = await editedValue.jsonValue();

        // Checks to make sure that the value was actually changed
        if(bool){
            expect(jsonEditedValue).toBe('Edited note');
        } else {
            expect(bool).toBe(true);
        }

    });

    it('Edit an existing note and remains after clicking outside note OR pressing tab', async () => {
        // The note from the previous test was edited
        const editedNote = await page.$('.note');
        await editedNote.click();

        const noteValue = await editedNote.getProperty('value');
        const jsonNoteValue = await noteValue.jsonValue();
        let bool = false;                                       // to check that the note was edited

        // Checks to make sure that the note is not empty (i.e. edited)
        if(jsonNoteValue != ''){
            // Edit the note and tab away
            await page.$eval('.note', e => e.value = '');       // Delete previous text
            await editedNote.type('Hi, I have work to do.');
            await page.keyboard.press('Tab');


            // Click back into the note
            await editedNote.click();
            
            bool = true;
        };

        const editedValue = await editedNote.getProperty('value');
        const jsonEditedValue = await editedValue.jsonValue();

        // Checks to make sure that the value was actually changed
        if(bool){
            expect(jsonEditedValue).toBe('Hi, I have work to do.');
        } else {
            expect(bool).toBe(true);
        }
    });

    it('Notes are still there (saved) after refreshing page', async () => {
        // Reload the page
        await page.reload();

        // Click into the note
        const editedNote = await page.$('.note');
        await editedNote.click();

        // Note value
        const noteValue = await editedNote.getProperty('value');
        const jsonNoteValue = await noteValue.jsonValue();

        expect(jsonNoteValue).toBe('Hi, I have work to do.');

    });

    it('Notes can be deleted by double clicking', async () => {
        const editedNote = await page.$('.note');
        await editedNote.click({ clickCount: 2});

        let bool = false;
        const localDataNew = await page.evaluate(() => {
            return localStorage.getItem('stickynotes-notes');  
        });
        console.log('This is localDataNew ' + localDataNew);
        if(localDataNew == '[]'){
            bool = true;
        }     

        expect(bool).toBe(true);
    });

    it('Notes can be deleted by ctrl + shift + d', async () => {
        const addNote = await page.$('.add-note');
        await addNote.click();
        await addNote.click();
        await addNote.click();

        // Check that there are notes
        let bool = true;
        const localData = await page.evaluate(() => {
            return localStorage.getItem('stickynotes-notes');  
        });
        // if local storage is empty, then there are no notes, so bool is false
        if(localData == '[]'){
            bool = false;
        }
        if(bool == false){
            expect(bool).toBe(true);
        };

        // Accepts the alert that pops up after using ctrl + shift + d
        page.on('dialog', async dialog => {
            await dialog.accept();
        });
        // Ctrl + shift + d
        await page.keyboard.down('ControlLeft');
        await page.keyboard.down('ShiftLeft');
        await page.keyboard.press('KeyD');
        await page.keyboard.up('ShiftLeft');
        await page.keyboard.up('ControlLeft');


        // Check that there are no more notes
        const localDataNew = await page.evaluate(() => {
            return localStorage.getItem('stickynotes-notes');  
        });
        console.log('This is localDataNew ' + localDataNew);
        // if local storage is empty, then bool is true here since the notes were deleted
        if(localDataNew == '[]'){
            bool = true;
        } else{
            bool = false;
        }

        expect(bool).toBe(true);
    });
    
});