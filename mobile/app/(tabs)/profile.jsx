import { View, Text, Alert } from 'react-native'
import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import styles from '../../assets/styles/profile.styles';
import ProfileHeader from '../../components/ProfileHeader';
import LogoutButton from '../../components/LogoutButton';


export default function profile() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const {token} = useAuthStore();
  
  const router = useRouter();

  const fetchData = async () => {
    try{
      setIsLoading(true);
    
          const response = await fetch(`${API_URL}/books/user`, {
            headers:{ Authorization: `Bearer ${token}` },
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
    </View>
  )
}