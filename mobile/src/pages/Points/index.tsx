import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Image, SafeAreaView} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import MapView, { Marker } from "react-native-maps";
import { SvgUri } from "react-native-svg";
import api from "../../services/api";
import Emoji from "react-native-emoji";

interface Item{
    id: number,
    title: string,
    image_url: string
}


const Points = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItems, setselectedItems] = useState<number[]>([]);
    const navigation = useNavigation();

    // FUNÇÃO QUE VERIFICA O ITEM ESCOLHIDO PELO USUÁRIO PARA SER COLETADO
	function handleSelectItem(id: number){
		// FINDINDEX: RETORNA UM NÚMERO ACIMA OU IGUAL A 0, SE O ITEM JÁ ESTIVER NO ARRAY
		const alrerySelected = selectedItems.findIndex(item => item === id);
		// SE O ITEM JÁ ESTIVER NO ARRAY ELE BUSCA E FAZ UM NOVO ARRAY SEM O MESMO
		if(alrerySelected > -1){
			const filteredItems = selectedItems.filter(item => item !== id);
			setselectedItems(filteredItems);
		}	
		else{
			setselectedItems([...selectedItems, id]);
		}
	}

    function handleNavigateBack(){
        navigation.goBack();
    }

    function handleNavigateToDetail(){
        navigation.navigate("Detail")
    }

    useEffect(() => {
        api.get("items").then(response => {
            setItems(response.data);
        })
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon 
                        name="arrow-left" 
                        color="#34cb79" 
                        size={25} 
                    />
                </TouchableOpacity>

                <Text style={styles.title}>
                    {/* <Emoji name="smile" style={{fontSize: 20}} /> */}
                    Bem vindo.
                </Text>
                <Text style={styles.description}>
                    Encontre no mapa um ponto de coleta
                </Text>

                <View style={styles.mapContainer}>
                    <MapView 
                        style={styles.map}
                        initialRegion={{
                            latitude: -12.2249261,
                            longitude: -38.9777095,
                            // 0.014 número para deixar o zoom do mapa ajustado
                            latitudeDelta: 0.014,
                            longitudeDelta: 0.014
                        }}
                    >
                        <Marker 
                            style={styles.mapMarker}
                            coordinate={{
                                latitude: -12.2249261,
                                longitude: -38.9777095,
                            }} 
                            onPress={handleNavigateToDetail}
                        >
                            <View style={styles.mapMarkerContainer}>
                                <Image 
                                    style={styles.mapMarkerImage}
                                    source={{
                                        uri: "https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60"
                                    }}
                                />

                                <Text style={styles.mapMarkerTitle}>
                                    Mercado
                                </Text>
                            </View>
                        </Marker>   
                    </MapView> 
                </View>
            </View>

            <View style={styles.itemsContainer}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                    {items.map(item => (
                        <TouchableOpacity 
                            key={String(item.id)}
                            style={[
                                styles.item,
                                selectedItems.includes(item.id) ? 
                                    styles.selectedItem 
                                    : {}
                            ]} 
                            onPress={() => handleSelectItem(item.id)}
                            activeOpacity={0.6}
                        >
                            <SvgUri 
                                width={42}
                                height={42}
                                uri={item.image_url}
                            />
                            <Text style={styles.itemTitle}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 20 + Constants.statusBarHeight,
    },

    title: {
        fontSize: 20,
        // fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 4,
        // fontFamily: 'Roboto_400Regular',
    },

    mapContainer: {
        flex: 1,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 16,
    },

    map: {
        width: '100%',
        height: '100%',
    },

    mapMarker: {
        width: 90,
        height: 80, 
    },

    mapMarkerContainer: {
        width: 90,
        height: 70,
        backgroundColor: '#34CB79',
        flexDirection: 'column',
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center'
    },

    mapMarkerImage: {
        width: 90,
        height: 45,
        resizeMode: 'cover',
    },

    mapMarkerTitle: {
        flex: 1,
        // fontFamily: 'Roboto_400Regular',
        color: '#FFF',
        fontSize: 13,
        lineHeight: 23,
    },

    itemsContainer: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 32,
    },

    item: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#eee',
        height: 120,
        width: 120,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'space-between',

        textAlign: 'center',
    },

    selectedItem: {
        borderColor: '#34CB79',
        borderWidth: 2,
    },

    itemTitle: {
        fontFamily: 'Roboto_400Regular',
        textAlign: 'center',
        fontSize: 13,
    },
});



export default Points;