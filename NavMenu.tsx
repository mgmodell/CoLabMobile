import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Menu, Divider } from 'react-native-paper';


export default function NavMenu( props ) {
    const [visible, setVisible] = useState( false );

    const openMenu = ()=> setVisible( true );
    const closeMenu = ()=> setVisible( false );

    return(
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={ <Button onPress={openMenu}>Show menu</Button> }
          >

          <Menu.Item onPress={() => {}} title="Item 1" />
          <Menu.Item onPress={() => {}} title="Item 2" />
          <Divider />
          <Menu.Item onPress={() => {}} title="Item 3" />
        </Menu>
    )
}