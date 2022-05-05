import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { warna } from "./warna";
import { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import * as Contacts from "expo-contacts";

export default function MainScreen({ navigation }) {
  const [text, settext] = useState("");
  const [DATA, setDATA] = useState([]);
  const [database, setDatabase] = useState();

  // Mengambil Data
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          const contact = data;
          setDATA(contact);
          setDatabase(contact);
        }
      }
    })();
  }, []);

  // Pilih Warna
  const pilihwarna = (id) => {
    let jml = 0;
    for (let i = 0; i < id.length; i++) {
      jml = jml + parseInt(id[i]);
    }
    let ubah = jml.toString();

    return warna[ubah[ubah.length - 1]];
  };

  // Fungsi Pencarian
  const cari = () => {
    let data = database;

    data = data.filter((item) =>
      item.name.toLocaleLowerCase().includes(text.toLocaleLowerCase())
    );
    setDATA(data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>Kontak Saya</Text>
      </View>

      <View style={styles.cariBorder}>
      
        <TextInput value={text} style={styles.cari}
          onChangeText={(text) => {
            settext(text);
          }}
          onKeyPress={() => {
            cari();
          }}
          placeholder={"Cari nama dari " + DATA.length + " Kontak"}
        />
      </View>
      

      <FlatList
        data={DATA}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.boxList}
              onPress={() => {
                navigation.navigate("Detail", { item });
              }}
            >
              <View
                style={[
                  styles.tampilanHuruf,
                  { backgroundColor: pilihwarna(item.id) },
                ]}
              >
                <Text style={styles.hurufStyle}>
                  {item.name[0].toUpperCase()}
                </Text>
              </View>
              <Text style={{ fontSize: 17 }}> {item.name} </Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity
        style={styles.buttonPlus}
        onPress={() => {
          navigation.navigate("Tambah Kontak");
        }}
      >
        <AntDesign name="plus" size={30} color="white" />
      </TouchableOpacity>

      <StatusBar backgroundColor="#FFF" barStyle="light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    backgroundColor: "white",
  },
  header: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ec19ae",
  },
  
  textHeader: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1.5,
    color: "#ffeeee",
  },
  cariBorder: {
    
    backgroundColor: "#e5eded",
    marginHorizontal: 18,
    marginVertical: 15,
    borderRadius: 30,
    paddingHorizontal: 20,
    padding:7,
  
  },
  cari: {
    color: "#000000",
    fontSize:17,
  },
  boxList: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    marginHorizontal: 15,
    marginVertical: 6,
    paddingLeft: 20,
  },
  tampilanHuruf: {
    fontSize: 18,
    borderRadius: 40,
    height: 50,
    width: 50,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  hurufStyle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  buttonPlus: {
    position: "absolute",
    top: 930,
    left: 400,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: "#db1472",
  },
});
