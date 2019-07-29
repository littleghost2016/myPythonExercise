from tkinter import *
import tkinter.messagebox as messagebox


class Application(Frame):
    """docstring for Applica"""

    def __init__(self, master=None):
        Frame.__init__(self, master)
        self.pack()
        self.createWidgets()

    def createWidgets(self):
        '''self.helloLabel = Label(self, text='Hello World!')
        self.helloLabel.pack()'''
        self.nameInput = Entry(self)
        self.nameInput.pack()
        self.quitButton = Button(self, text='Quit', command=self.hello)
        self.quitButton.pack()

    def hello(self):
        name = self.nameInput.get() or 'world'
        messagebox.showinfo('Message', 'Hello, {0}'.format(name))


app = Application()
app.master.title('Hello World')
app.mainloop()
