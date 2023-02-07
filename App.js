/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from "react";
import { StyleSheet, Text, TouchableOpacity, Button } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  createStackNavigator,
  HeaderBackButton,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./src/pages/Login";
import Menu from "./src/pages/Menu";
import ErrorLogin from "./src/pages/ErrorLogin";
import Recolectar from "./src/pages/Recolectar";
import Sincronizar from "./src/pages/Sincronizar";
import RecolectarD from "./src/pages/RecolectarD";
import RecolectarDTable from "./src/pages/RecolectarDTable";
import RecolectarDStatus from "./src/pages/RecolectarDStatus";
import RecolectarDComentario from "./src/pages/RecolectarDComentario";
import Impresora from "./src/pages/Impresora";
import AddPrinter from "./src/pages/AddPrinter";
import Cierre from "./src/pages/Cierre";

const App = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#00843D" },
          headerTintColor: "#fff",
        }}
      >
        <Stack.Screen
          name="Menu"
          component={Menu}
          options={({ navigation }) => ({
            title: "Prefaena Opciones",
            headerRight: () => (
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Login")}
              >
                <Icon name="sign-in" size={30} color="#fff" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="ErrorLogin"
          component={ErrorLogin}
          options={{ headerTitle: "Error ingresando" }}
        />
        <Stack.Screen
          name="Sincronizar"
          component={Sincronizar}
          options={{ headerTitle: "Sincronizar Datos" }}
        />
        <Stack.Screen
          name="Recolectar"
          component={Recolectar}
          options={{ headerTitle: "Listaje de Tickets" }}
        />
        <Stack.Screen
          name="RecolectarD"
          component={RecolectarD}
          options={{ headerTitle: "Detalle de Recolección" }}
        />
        <Stack.Screen
          name="RecolectarDTable"
          component={RecolectarDTable}
          options={{ headerTitle: "Agregar galpones a recolección" }}
        />
        <Stack.Screen
          name="RecolectarDStatus"
          component={RecolectarDStatus}
          options={{ headerTitle: "Cambiar estatus de ticket" }}
        />
        <Stack.Screen
          name="RecolectarDComentario"
          component={RecolectarDComentario}
          options={{ headerTitle: "Crear comentario a ticket" }}
        />
        <Stack.Screen
          name="Impresora"
          component={Impresora}
          options={({ navigation }) => ({
            headerTitle: "Imprimir ticket",
            headerLeft: (props) => (
              <HeaderBackButton
                {...props}
                onPress={() => {
                  navigation.navigate("Recolectar");
                }}
              />
            ),
          })}
        />
        <Stack.Screen
          name="AddPrinter"
          component={AddPrinter}
          options={({ route, navigation }) => ({
            headerTitle: "Configurar Impresora",
            headerLeft: (props) => (
              <HeaderBackButton
                {...props}
                onPress={() => {
                  navigation.navigate("Menu");
                }}
              />
            ),
          })}
        />
        <Stack.Screen
          name="Cierre"
          component={Cierre}
          options={({ navigation }) => ({
            headerTitle: "Cierre de Prefaena",
            headerLeft: (props) => (
              <HeaderBackButton
                {...props}
                onPress={() => {
                  navigation.navigate("Recolectar");
                }}
              />
            ),
          })}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Proagro Prefaena" }}
        />
      </Stack.Navigator>
      <Text style={styles.footer}> GlobalDv C.A - Prefaena Version 1.5.1 </Text>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#00843D",
    padding: 10,
  },
  font: {
    fontFamily: 'Ubuntu',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    fontFamily: 'Ubuntu',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#00843D',
  },
});

export default App;
