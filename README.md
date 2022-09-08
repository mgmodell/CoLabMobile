1. **Navigate to the working directory on your computer.**
	- cd dev
	- dev clm
	- clm git:(main)

2. **Do a git pull to update files.**
	- clm git:(main) git pull

3. **Install asdf**
	- clm git:(main) asdf install
		
4. **If message received is “Install plugins first to be able to install tools” Then install the following plugins, if not then go to step 7.** 

5. **Install plugins**
	- clm git:(main) asdf plugin add nodejs                  
	- clm git:(main) asdf plugin add bundler
	- clm git:(main) asdf plugin add ruby 
	- clm git:(main) asdf plugin add yarn

6. **Attempt to install asdf**
	- clm git:(main) asdf install

7. **If the following error message occurs**
   
*Missing one or more of the following dependencies: tar, gpg* then

   - clm git:(main) brew install gpg
  
**If no error message then proceed to step 8.**
		
8. **Switch to IOS**

	- clm git:(main) ios

9. **Install asdf on IOS**

	- ios git:(main) asdf install

10. **Navigate back to clm main and install yarn**

	- ios git:(main) cd ..
	- clm git:(main) yarn install


11. **Run npx command.**

	- clm git:(main) npx react-native run-ios —verbose
  
	**If success then skip the following steps.**

12. **Navigate to iOS and install pod**

	- clm git:(main) cd ios
	- ios git:(main) pod install

13. **Navigate back to clm**
	- ios git:(main) ✗ cd ..
	

14. **Try to run the simulator**
	- clm git:(main)  npx react-native run-ios --verbose
