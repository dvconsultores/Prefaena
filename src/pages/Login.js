/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useEffect, useState } from "react";
 import {
   StyleSheet,
   Text,
   View,
   TextInput,
   TouchableOpacity,
   Image,
   Alert,
   ActivityIndicator,
 } from "react-native";
 import axios from "axios";
 import DeviceInfo from "react-native-device-info";
 
 function delay(timeout) {
   return new Promise((resolve) => {
     setTimeout(resolve, timeout);
   });
 }
 
 const Login = ({ navigation }) => {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [mac, setMac] = useState(DeviceInfo.getUniqueId());
   const [load, setLoad] = useState(false);
 
   const logOut = () => {
     try {
       const response = axios.get(global.baseurl + "/logout/");
       //setList(response.data);
       //alert('load');
       //console.log(response.data);
       //delay(1500).then(() => setLoad(false));
     } catch (error) {
       // handle error
       alert(error.message);
     }
   };
 
   //Hook
   useEffect(() => {
     //Generar las tablas si no existen
     // logOut();
     //DeviceInfo.getMacAddress().then((mac) => {
       // "E5:12:D8:E5:69:97"
 
     //  setMac(mac);
     //});
   }, []);
 
   function login() {
     setLoad(true);
     //const uniqueId = DeviceInfo.getUniqueId();
     const payload = { username, password, mac };
     // console.log(global.baseurl + "/login/");
 
     axios
       .post(global.baseurl + "/login/", payload, {
         headers: { "Content-Type": "application/x-www-form-urlencoded" },
       })
       .then((res) => {
         // Alert.alert("Contraseña inválida", res);
         const token = res.data.token;
         const admin = res.data.admin.toString();
         axios.defaults.headers.common.Authorization = "Token " + token;
         axios.defaults.headers.post["Content-Type"] =
           "application/x-www-form-urlencoded";
         setTimeout(() => {
           setLoad(false);
         }, 350);
         navigation.navigate("Menu", { admin: admin });
       })
       .catch((err) => {
         // console.log(err);
         navigation.navigate("ErrorLogin");
       });
   }
 
   return (
     <View style={styles.container}>
       <Image
         source={require("../assets/img/LogoProagro.png")}
         style={styles.logo}
       />
       <View style={styles.inputView}>
         <TextInput
           style={styles.inputText}
           placeholder="Usuario"
           placeholderTextColor="#090909"
           onChangeText={(text) => setUsername(text)}
         />
       </View>
       <View style={styles.inputView}>
         <TextInput
           secureTextEntry
           style={styles.inputText}
           placeholder="Contraseña"
           placeholderTextColor="#090909"
           onChangeText={(text) => setPassword(text)}
         />
       </View>
       {load ? (
         <ActivityIndicator
           //visibility of Overlay Loading Spinner
           visible={load}
           //Text with the Spinner
           textContent={"Cargando..."}
           size="large"
           color="#FFD100"
         />
       ) : (
         <>
           <TouchableOpacity style={styles.loginBtn} onPress={login.bind(this)}>
             <Text style={styles.loginText}>Ingresar</Text>
           </TouchableOpacity>
         </>
       )}
     </View>
   );
 };
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: "#fff",
     alignItems: "center",
     justifyContent: "center",
     fontFamily: "Carrois Gothic SC",
   },
   logo: {
     marginBottom: 40,
   },
   inputView: {
     width: "80%",
     backgroundColor: "#f4f4f4",
     borderRadius: 10,
     height: 60,
     marginBottom: 20,
     justifyContent: "center",
     padding: 20,
     borderWidth: 1.5,
     borderColor: "gray",
   },
   inputText: {
     height: 50,
     color: "black",
     fontFamily: "Carrois Gothic SC",
   },
   loginBtn: {
     width: "80%",
     backgroundColor: "#00843D",
     borderRadius: 10,
     height: 60,
     alignItems: "center",
     justifyContent: "center",
     marginTop: 40,
     marginBottom: 10,
     fontFamily: "Ubuntu",
   },
   loginText: {
     color: "white",
   },
 });
 
 export default Login;
 