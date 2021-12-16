# Some native methods aren't accessible right away after setting a ref

This problem is a little complicated to describe, so I'll set it up first with the scenario I was investigating when I ran into this issue.

# Scenario description
I was working on adding focus support to a screen that had a flat list (whose items are touchable). By default, nothing on the screen automatically grabs focus.
Fortunately, there is a .focus() method I found on the <TouchableOpacity /> and <Pressable /> components that seems to do the trick.
As long as I can grab a ref to the flat list item that I want to give initial focus to, I can call ref.focus() to achieve the desired result

This is a little bit tricky with a flat list, especially when you want to support right-to-left, because this means you need to dynamically manage refs to at least two items in the list. So what I decided to do was create a ref array with n refs inside of it (where n is the size of the data input for the flat list).
Then, in the renderItems function I simply accessed the corresponding ref and set it on the flat list item view (using a forward ref to pass it through to the base touchable component)

Once I had my ref data structure initialized and each ref set to its respective component, the last thing I needed to do was find a way to pick the item I want to give initial focus to, and call .focus() on its ref.
I decided to do this with a useEffect.

## The problem

What I was expecting to see after calling .focus() on the flat list item I want to initially give focus to, was that the TouchableOpacity or Pressable component under the hood would get focused. Instead - nothing happened.

On further inspection, I found that the call to .focus() was happening correctly. The ref was being set and accessed correctly. I went into Visual Studio live XAML tree debugging tool and mapped the react tag I was seeing in the chrome debugger to the native view, and confirmed that the dimensions and color matched to grow confidence that we were calling .focus() on the correct ref.

So it seems like despite doing all the right things, .focus() just doesn't seem to work in this scenario. The weird thing is, that it works for me in other scenarios where I manually managed a ref (i.e. a screen with just a few buttons, so I created a named ref for each button).

I did discover a workaround that may help root cause the issue.
If I call setTimeout(cb, 1) with even just 1ms, and then call .focus() in the timer callback, this appears to work.
Makes me wonder if the .focus() method is just not active on the first render after setting the ref.