import { View, Text, Alert } from 'react-native'
import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import styles from '../../assets/styles/profile.styles';
import ProfileHeader from '../../components/ProfileHeader';
import LogoutButton from '../../components/LogoutButton';
import { API_URL } from "../../constants/api";



export default function profile() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const {token} = useAuthStore();
  
  const router = useRouter();

  const fetchData = async () => {
    try{
      setIsLoading(true);
    
          const response = await fetch(`${API_URL}/books`, {
            headers:{
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          if(!response.ok) throw new Error(data.message || "Failed to fetch user book");

          setBooks(data);
    }catch(error){
            console.log("Error Creating post:", error);
            Alert.alert("Error", error.message || "something went wrong");
    }finally{
      setIsLoading(false);
    }
   };

   useEffect(() => {
    fetchData();
   }, []);
  return (
    <View style={styles.container}>
      {/* <ProfileHeader /> */}
      <LogoutButton />
      <View style={styles.booksHeader}>
      <Text style={styles.bookTitle}>Your Recommendation</Text>
      <Text style={styles.booksCount}>{books.length}</Text>
      </View>
    </View>
  )
}