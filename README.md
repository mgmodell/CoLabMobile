1. **Navigate to the working directory on your computer.**
	- cd dev
	- cd clm

2. **Do a git pull to update files.**
	- git pull

3. **Install asdf**
	- asdf install
		
4. **If message received is “Install plugins first to be able to install tools” Then install the following plugins, if not then go to step 7.** 

5. **Install plugins**
	- asdf plugin add nodejs                  
	- asdf plugin add bundler
	- asdf plugin add ruby 
	- asdf plugin add yarn

6. **Attempt to install asdf**
	- asdf install

7. **If the following error message occurs**
   
*Missing one or more of the following dependencies: tar, gpg* then

   - brew install gpg
  
**If no error message then proceed to step 8.**
		
8. **Switch to IOS**

	- cd ios

9. **Install asdf on IOS**

	- asdf install

10. **Navigate back to clm main and install yarn**

	- cd clm
	- yarn install


11. **Run npx command.**

	- npx react-native run-ios —verbose
  
	**If success then skip the following steps.**

12. **Navigate to iOS and install pod**

	- cd ios
	- pod install

13. **Navigate back to clm**
	- cd clm
	

14. **Try to run the simulator**
	- npx react-native run-ios --verbose

15. ** Now the simulator should be running!**
