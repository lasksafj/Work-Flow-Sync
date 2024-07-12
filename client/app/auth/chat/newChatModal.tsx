// import { View, Text, StyleSheet, Image } from 'react-native';
// import { Colors } from '@/constants/Colors';
// import { AlphabetList } from 'react-native-section-alphabet-list';
// import { defaultStyles } from '@/constants/Styles';

// const contacts = [
//     {
//         "first_name": "Ward",
//         "last_name": "Sims",
//         "img": "https://i.pravatar.cc/150?u=wardsims@genmy.com",
//         "desc": "Deserunt ipsum commodo magna minim nostrud voluptate qui pariatur ad excepteur."
//     },
//     {
//         "first_name": "Saundra",
//         "last_name": "Lott",
//         "img": "https://i.pravatar.cc/150?u=saundralott@genmy.com",
//         "desc": "Aliqua deserunt in laborum veniam enim non culpa duis mollit elit consectetur."
//     },
//     {
//         "first_name": "Annmarie",
//         "last_name": "Simpson",
//         "img": "https://i.pravatar.cc/150?u=annmariesimpson@genmy.com",
//         "desc": "Dolore incididunt nisi id ex cillum officia aliquip dolore."
//     },
//     {
//         "first_name": "Shelby",
//         "last_name": "Raymond",
//         "img": "https://i.pravatar.cc/150?u=shelbyraymond@genmy.com",
//         "desc": "Nisi labore culpa eu ex mollit minim veniam sint."
//     },
//     {
//         "first_name": "Warren",
//         "last_name": "Mendez",
//         "img": "https://i.pravatar.cc/150?u=warrenmendez@genmy.com",
//         "desc": "Nulla enim dolor consequat ut pariatur enim pariatur excepteur."
//     },
//     {
//         "first_name": "Hampton",
//         "last_name": "Buckley",
//         "img": "https://i.pravatar.cc/150?u=hamptonbuckley@genmy.com",
//         "desc": "Incididunt ullamco ut do ea minim."
//     },
//     {
//         "first_name": "Connie",
//         "last_name": "Vinson",
//         "img": "https://i.pravatar.cc/150?u=connievinson@genmy.com",
//         "desc": "Mollit adipisicing laboris ea aliquip in dolor officia dolor excepteur."
//     },
//     {
//         "first_name": "Key",
//         "last_name": "Fletcher",
//         "img": "https://i.pravatar.cc/150?u=keyfletcher@genmy.com",
//         "desc": "Irure consequat laborum aliquip enim ex ullamco et voluptate anim."
//     },
//     {
//         "first_name": "Wendy",
//         "last_name": "Woodward",
//         "img": "https://i.pravatar.cc/150?u=wendywoodward@genmy.com",
//         "desc": "Proident id culpa amet laboris ad sit tempor officia."
//     },
//     {
//         "first_name": "Burt",
//         "last_name": "Velazquez",
//         "img": "https://i.pravatar.cc/150?u=burtvelazquez@genmy.com",
//         "desc": "Non pariatur tempor elit exercitation officia proident amet ut aute proident minim officia."
//     },
//     {
//         "first_name": "Marjorie",
//         "last_name": "Bonner",
//         "img": "https://i.pravatar.cc/150?u=marjoriebonner@genmy.com",
//         "desc": "Aute exercitation cupidatat elit mollit minim nisi ullamco et consequat sit qui pariatur."
//     },
//     {
//         "first_name": "Harrison",
//         "last_name": "Bass",
//         "img": "https://i.pravatar.cc/150?u=harrisonbass@genmy.com",
//         "desc": "Cillum mollit adipisicing eu sit."
//     },
//     {
//         "first_name": "Darcy",
//         "last_name": "Copeland",
//         "img": "https://i.pravatar.cc/150?u=darcycopeland@genmy.com",
//         "desc": "Minim pariatur labore exercitation culpa qui culpa est voluptate ad."
//     },
//     {
//         "first_name": "Justine",
//         "last_name": "Malone",
//         "img": "https://i.pravatar.cc/150?u=justinemalone@genmy.com",
//         "desc": "Consequat occaecat non adipisicing dolore aliquip voluptate incididunt incididunt irure aliquip tempor officia occaecat proident."
//     },
//     {
//         "first_name": "Dorsey",
//         "last_name": "Slater",
//         "img": "https://i.pravatar.cc/150?u=dorseyslater@genmy.com",
//         "desc": "Exercitation culpa laborum occaecat anim."
//     },
//     {
//         "first_name": "Marla",
//         "last_name": "Mcintosh",
//         "img": "https://i.pravatar.cc/150?u=marlamcintosh@genmy.com",
//         "desc": "Minim minim laboris aute sint deserunt aliqua aliqua consequat pariatur sint consequat et aute."
//     },
//     {
//         "first_name": "Sheila",
//         "last_name": "Bryan",
//         "img": "https://i.pravatar.cc/150?u=sheilabryan@genmy.com",
//         "desc": "Non culpa cupidatat occaecat irure sit."
//     },
//     {
//         "first_name": "Atkins",
//         "last_name": "Emerson",
//         "img": "https://i.pravatar.cc/150?u=atkinsemerson@genmy.com",
//         "desc": "Sint exercitation consequat sit dolor pariatur reprehenderit sunt do mollit aute ex cillum."
//     },
//     {
//         "first_name": "Hardy",
//         "last_name": "Gillespie",
//         "img": "https://i.pravatar.cc/150?u=hardygillespie@genmy.com",
//         "desc": "Sunt commodo sint ullamco anim pariatur cupidatat voluptate dolore consequat in fugiat officia ad quis."
//     },
// ];

// const Page = () => {
//     const data = contacts.map((contact, index) => ({
//         value: `${contact.first_name} ${contact.last_name}`,
//         name: `${contact.first_name} ${contact.last_name}`,
//         img: contact.img,
//         desc: contact.desc,
//         key: `${contact.first_name} ${contact.last_name}-${index}`,
//     }));

//     return (
//         <View style={{ flex: 1, paddingTop: 110, backgroundColor: Colors.background }}>
//             <AlphabetList
//                 data={data}
//                 stickySectionHeadersEnabled
//                 indexLetterStyle={{
//                     color: Colors.primary,
//                     fontSize: 12,
//                 }}
//                 indexContainerStyle={{
//                     width: 24,
//                     backgroundColor: Colors.background,
//                 }}
//                 renderCustomItem={(item: any) => (
//                     <>
//                         <View style={styles.listItemContainer}>
//                             <Image source={{ uri: item.img }} style={styles.listItemImage} />
//                             <View>
//                                 <Text style={{ color: '#000', fontSize: 14 }}>{item.value}</Text>
//                                 <Text style={{ color: Colors.gray, fontSize: 12 }}>
//                                     {item.desc.length > 40 ? `${item.desc.substring(0, 40)}...` : item.desc}
//                                 </Text>
//                             </View>
//                         </View>
//                         <View style={[defaultStyles.separator, { marginLeft: 50 }]} />
//                     </>
//                 )}
//                 renderCustomSectionHeader={(section) => (
//                     <View style={styles.sectionHeaderContainer}>
//                         <Text style={{ color: Colors.gray }}>{section.title}</Text>
//                     </View>
//                 )}
//                 style={{
//                     marginLeft: 14,
//                 }}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     listItemContainer: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 10,
//         height: 50,
//         paddingHorizontal: 14,
//         backgroundColor: '#fff',
//     },

//     listItemImage: {
//         width: 30,
//         height: 30,
//         borderRadius: 15,
//     },

//     sectionHeaderContainer: {
//         height: 30,
//         backgroundColor: Colors.background,
//         justifyContent: 'center',
//         paddingHorizontal: 14,
//     },
// });

// export default Page;