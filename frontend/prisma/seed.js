const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const sellerPassword = await bcrypt.hash('seller123', 10);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      storeName: 'Platform Admin',
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { username: 'seller1' },
    update: {},
    create: {
      username: 'seller1',
      password: sellerPassword,
      storeName: 'Demo Store',
      role: 'SELLER',
    },
  });

  await prisma.setting.upsert({
    where: { key: 'upi_id' },
    update: {},
    create: { key: 'upi_id', value: 'admin@upi' },
  });

  const pincodes = [
    // Andhra Pradesh
    { pincode: '520001', city: 'Vijayawada', state: 'Andhra Pradesh' },
    { pincode: '530001', city: 'Visakhapatnam', state: 'Andhra Pradesh' },
    { pincode: '515001', city: 'Anantapur', state: 'Andhra Pradesh' },
    { pincode: '516001', city: 'Kadapa', state: 'Andhra Pradesh' },
    { pincode: '518001', city: 'Kurnool', state: 'Andhra Pradesh' },
    { pincode: '523001', city: 'Ongole', state: 'Andhra Pradesh' },
    { pincode: '524001', city: 'Nellore', state: 'Andhra Pradesh' },
    { pincode: '535001', city: 'Vizianagaram', state: 'Andhra Pradesh' },
    { pincode: '532001', city: 'Srikakulam', state: 'Andhra Pradesh' },
    { pincode: '522001', city: 'Guntur', state: 'Andhra Pradesh' },
    { pincode: '533001', city: 'Rajahmundry', state: 'Andhra Pradesh' },
    { pincode: '534001', city: 'Eluru', state: 'Andhra Pradesh' },
    // Arunachal Pradesh
    { pincode: '791111', city: 'Itanagar', state: 'Arunachal Pradesh' },
    { pincode: '792001', city: 'Pasighat', state: 'Arunachal Pradesh' },
    { pincode: '791001', city: 'Naharlagun', state: 'Arunachal Pradesh' },
    // Assam
    { pincode: '781001', city: 'Guwahati', state: 'Assam' },
    { pincode: '782001', city: 'Jorhat', state: 'Assam' },
    { pincode: '785001', city: 'Dibrugarh', state: 'Assam' },
    { pincode: '788001', city: 'Silchar', state: 'Assam' },
    { pincode: '783301', city: 'Barpeta', state: 'Assam' },
    { pincode: '784001', city: 'Tezpur', state: 'Assam' },
    // Bihar
    { pincode: '800001', city: 'Patna', state: 'Bihar' },
    { pincode: '842001', city: 'Muzaffarpur', state: 'Bihar' },
    { pincode: '846001', city: 'Darbhanga', state: 'Bihar' },
    { pincode: '823001', city: 'Gaya', state: 'Bihar' },
    { pincode: '845401', city: 'Motihari', state: 'Bihar' },
    { pincode: '851001', city: 'Begusarai', state: 'Bihar' },
    { pincode: '811201', city: 'Bihar Sharif', state: 'Bihar' },
    { pincode: '802301', city: 'Buxar', state: 'Bihar' },
    { pincode: '803101', city: 'Chhapra', state: 'Bihar' },
    { pincode: '805101', city: 'Hajipur', state: 'Bihar' },
    { pincode: '843101', city: 'Sitamarhi', state: 'Bihar' },
    { pincode: '848101', city: 'Samastipur', state: 'Bihar' },
    { pincode: '821301', city: 'Sasaram', state: 'Bihar' },
    // Chandigarh
    { pincode: '160001', city: 'Chandigarh', state: 'Chandigarh' },
    // Chhattisgarh
    { pincode: '492001', city: 'Raipur', state: 'Chhattisgarh' },
    { pincode: '490001', city: 'Bhilai', state: 'Chhattisgarh' },
    { pincode: '495001', city: 'Bilaspur', state: 'Chhattisgarh' },
    { pincode: '491001', city: 'Durg', state: 'Chhattisgarh' },
    { pincode: '496001', city: 'Raigarh', state: 'Chhattisgarh' },
    { pincode: '497001', city: 'Ambikapur', state: 'Chhattisgarh' },
    // Delhi
    { pincode: '110001', city: 'New Delhi', state: 'Delhi' },
    { pincode: '110002', city: 'Connaught Place', state: 'Delhi' },
    { pincode: '110006', city: 'Chandni Chowk', state: 'Delhi' },
    { pincode: '110016', city: 'Hauz Khas', state: 'Delhi' },
    { pincode: '110017', city: 'Malviya Nagar', state: 'Delhi' },
    { pincode: '110019', city: 'Greater Kailash', state: 'Delhi' },
    { pincode: '110020', city: 'Okhla', state: 'Delhi' },
    { pincode: '110023', city: 'Jangpura', state: 'Delhi' },
    { pincode: '110024', city: 'Khan Market', state: 'Delhi' },
    { pincode: '110025', city: 'Lajpat Nagar', state: 'Delhi' },
    { pincode: '110026', city: 'Kashmere Gate', state: 'Delhi' },
    { pincode: '110030', city: 'Vasant Kunj', state: 'Delhi' },
    { pincode: '110048', city: 'Saket', state: 'Delhi' },
    { pincode: '110065', city: 'Dwarka', state: 'Delhi' },
    { pincode: '110085', city: 'Rohini', state: 'Delhi' },
    { pincode: '110090', city: 'Pitampura', state: 'Delhi' },
    { pincode: '110092', city: 'Shahdara', state: 'Delhi' },
    { pincode: '110094', city: 'Narela', state: 'Delhi' },
    // Goa
    { pincode: '403001', city: 'Panaji', state: 'Goa' },
    { pincode: '403002', city: 'Mapusa', state: 'Goa' },
    { pincode: '403601', city: 'Margao', state: 'Goa' },
    { pincode: '403706', city: 'Vasco da Gama', state: 'Goa' },
    // Gujarat
    { pincode: '380001', city: 'Ahmedabad', state: 'Gujarat' },
    { pincode: '395001', city: 'Surat', state: 'Gujarat' },
    { pincode: '390001', city: 'Vadodara', state: 'Gujarat' },
    { pincode: '360001', city: 'Rajkot', state: 'Gujarat' },
    { pincode: '382001', city: 'Gandhinagar', state: 'Gujarat' },
    { pincode: '364001', city: 'Bhavnagar', state: 'Gujarat' },
    { pincode: '361001', city: 'Jamnagar', state: 'Gujarat' },
    { pincode: '385001', city: 'Banaskantha', state: 'Gujarat' },
    { pincode: '388001', city: 'Anand', state: 'Gujarat' },
    { pincode: '393001', city: 'Bharuch', state: 'Gujarat' },
    { pincode: '370001', city: 'Bhuj', state: 'Gujarat' },
    { pincode: '396001', city: 'Valsad', state: 'Gujarat' },
    { pincode: '362001', city: 'Junagadh', state: 'Gujarat' },
    { pincode: '365001', city: 'Amreli', state: 'Gujarat' },
    // Haryana
    { pincode: '122001', city: 'Gurugram', state: 'Haryana' },
    { pincode: '121001', city: 'Faridabad', state: 'Haryana' },
    { pincode: '134001', city: 'Ambala', state: 'Haryana' },
    { pincode: '136001', city: 'Kurukshetra', state: 'Haryana' },
    { pincode: '132001', city: 'Karnal', state: 'Haryana' },
    { pincode: '133001', city: 'Panipat', state: 'Haryana' },
    { pincode: '125001', city: 'Hisar', state: 'Haryana' },
    { pincode: '124001', city: 'Rohtak', state: 'Haryana' },
    { pincode: '126001', city: 'Jind', state: 'Haryana' },
    { pincode: '131001', city: 'Sonipat', state: 'Haryana' },
    { pincode: '127001', city: 'Bhiwani', state: 'Haryana' },
    { pincode: '123001', city: 'Rewari', state: 'Haryana' },
    { pincode: '135001', city: 'Yamunanagar', state: 'Haryana' },
    // Himachal Pradesh
    { pincode: '171001', city: 'Shimla', state: 'Himachal Pradesh' },
    { pincode: '175001', city: 'Mandi', state: 'Himachal Pradesh' },
    { pincode: '176001', city: 'Palampur', state: 'Himachal Pradesh' },
    { pincode: '177001', city: 'Hamirpur', state: 'Himachal Pradesh' },
    { pincode: '172001', city: 'Solan', state: 'Himachal Pradesh' },
    // Jharkhand
    { pincode: '834001', city: 'Ranchi', state: 'Jharkhand' },
    { pincode: '831001', city: 'Jamshedpur', state: 'Jharkhand' },
    { pincode: '826001', city: 'Dhanbad', state: 'Jharkhand' },
    { pincode: '827001', city: 'Bokaro', state: 'Jharkhand' },
    { pincode: '814112', city: 'Deoghar', state: 'Jharkhand' },
    { pincode: '833101', city: 'Chaibasa', state: 'Jharkhand' },
    // Karnataka
    { pincode: '560001', city: 'Bangalore', state: 'Karnataka' },
    { pincode: '575001', city: 'Mangalore', state: 'Karnataka' },
    { pincode: '580001', city: 'Hubli', state: 'Karnataka' },
    { pincode: '570001', city: 'Mysore', state: 'Karnataka' },
    { pincode: '585101', city: 'Gulbarga', state: 'Karnataka' },
    { pincode: '583201', city: 'Bellary', state: 'Karnataka' },
    { pincode: '577001', city: 'Davangere', state: 'Karnataka' },
    { pincode: '581201', city: 'Hospet', state: 'Karnataka' },
    { pincode: '587101', city: 'Bagalkot', state: 'Karnataka' },
    { pincode: '591101', city: 'Belgaum', state: 'Karnataka' },
    { pincode: '573201', city: 'Hassan', state: 'Karnataka' },
    { pincode: '574201', city: 'Udupi', state: 'Karnataka' },
    { pincode: '577101', city: 'Shimoga', state: 'Karnataka' },
    // Kerala
    { pincode: '695001', city: 'Thiruvananthapuram', state: 'Kerala' },
    { pincode: '682001', city: 'Kochi', state: 'Kerala' },
    { pincode: '673001', city: 'Kozhikode', state: 'Kerala' },
    { pincode: '686001', city: 'Kottayam', state: 'Kerala' },
    { pincode: '683101', city: 'Alappuzha', state: 'Kerala' },
    { pincode: '678001', city: 'Palakkad', state: 'Kerala' },
    { pincode: '670001', city: 'Kannur', state: 'Kerala' },
    { pincode: '680001', city: 'Thrissur', state: 'Kerala' },
    { pincode: '685001', city: 'Kollam', state: 'Kerala' },
    { pincode: '671121', city: 'Kasaragod', state: 'Kerala' },
    { pincode: '676101', city: 'Malappuram', state: 'Kerala' },
    // Madhya Pradesh
    { pincode: '462001', city: 'Bhopal', state: 'Madhya Pradesh' },
    { pincode: '452001', city: 'Indore', state: 'Madhya Pradesh' },
    { pincode: '482001', city: 'Jabalpur', state: 'Madhya Pradesh' },
    { pincode: '474001', city: 'Gwalior', state: 'Madhya Pradesh' },
    { pincode: '456001', city: 'Ujjain', state: 'Madhya Pradesh' },
    { pincode: '485001', city: 'Satna', state: 'Madhya Pradesh' },
    { pincode: '470001', city: 'Sagar', state: 'Madhya Pradesh' },
    { pincode: '476001', city: 'Morena', state: 'Madhya Pradesh' },
    { pincode: '473001', city: 'Guna', state: 'Madhya Pradesh' },
    { pincode: '480001', city: 'Chhindwara', state: 'Madhya Pradesh' },
    { pincode: '481001', city: 'Balaghat', state: 'Madhya Pradesh' },
    { pincode: '472001', city: 'Tikamgarh', state: 'Madhya Pradesh' },
    // Maharashtra
    { pincode: '400001', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '411001', city: 'Pune', state: 'Maharashtra' },
    { pincode: '440001', city: 'Nagpur', state: 'Maharashtra' },
    { pincode: '431001', city: 'Aurangabad', state: 'Maharashtra' },
    { pincode: '422001', city: 'Nashik', state: 'Maharashtra' },
    { pincode: '416001', city: 'Kolhapur', state: 'Maharashtra' },
    { pincode: '402001', city: 'Raigad', state: 'Maharashtra' },
    { pincode: '415001', city: 'Satara', state: 'Maharashtra' },
    { pincode: '413001', city: 'Solapur', state: 'Maharashtra' },
    { pincode: '424001', city: 'Dhule', state: 'Maharashtra' },
    { pincode: '444601', city: 'Amravati', state: 'Maharashtra' },
    { pincode: '441001', city: 'Akola', state: 'Maharashtra' },
    { pincode: '421201', city: 'Thane', state: 'Maharashtra' },
    { pincode: '410101', city: 'Lonavala', state: 'Maharashtra' },
    { pincode: '412101', city: 'Baramati', state: 'Maharashtra' },
    // Manipur
    { pincode: '795001', city: 'Imphal', state: 'Manipur' },
    // Meghalaya
    { pincode: '793001', city: 'Shillong', state: 'Meghalaya' },
    // Mizoram
    { pincode: '796001', city: 'Aizawl', state: 'Mizoram' },
    // Nagaland
    { pincode: '797001', city: 'Dimapur', state: 'Nagaland' },
    { pincode: '798601', city: 'Kohima', state: 'Nagaland' },
    // Odisha
    { pincode: '751001', city: 'Bhubaneswar', state: 'Odisha' },
    { pincode: '753001', city: 'Cuttack', state: 'Odisha' },
    { pincode: '760001', city: 'Sambalpur', state: 'Odisha' },
    { pincode: '769001', city: 'Rourkela', state: 'Odisha' },
    { pincode: '752001', city: 'Puri', state: 'Odisha' },
    { pincode: '762001', city: 'Bhadrak', state: 'Odisha' },
    { pincode: '759001', city: 'Balasore', state: 'Odisha' },
    // Punjab
    { pincode: '141001', city: 'Ludhiana', state: 'Punjab' },
    { pincode: '143001', city: 'Amritsar', state: 'Punjab' },
    { pincode: '147001', city: 'Patiala', state: 'Punjab' },
    { pincode: '144001', city: 'Jalandhar', state: 'Punjab' },
    { pincode: '160014', city: 'Mohali', state: 'Punjab' },
    { pincode: '151001', city: 'Bathinda', state: 'Punjab' },
    { pincode: '145001', city: 'Pathankot', state: 'Punjab' },
    { pincode: '146001', city: 'Hoshiarpur', state: 'Punjab' },
    { pincode: '152001', city: 'Firozpur', state: 'Punjab' },
    // Rajasthan
    { pincode: '302001', city: 'Jaipur', state: 'Rajasthan' },
    { pincode: '342001', city: 'Jodhpur', state: 'Rajasthan' },
    { pincode: '313001', city: 'Udaipur', state: 'Rajasthan' },
    { pincode: '334001', city: 'Bikaner', state: 'Rajasthan' },
    { pincode: '345001', city: 'Jaisalmer', state: 'Rajasthan' },
    { pincode: '311001', city: 'Bhilwara', state: 'Rajasthan' },
    { pincode: '324001', city: 'Kota', state: 'Rajasthan' },
    { pincode: '301001', city: 'Alwar', state: 'Rajasthan' },
    { pincode: '332001', city: 'Sikar', state: 'Rajasthan' },
    { pincode: '321001', city: 'Bharatpur', state: 'Rajasthan' },
    { pincode: '335001', city: 'Sri Ganganagar', state: 'Rajasthan' },
    { pincode: '312001', city: 'Chittorgarh', state: 'Rajasthan' },
    // Sikkim
    { pincode: '737101', city: 'Gangtok', state: 'Sikkim' },
    // Tamil Nadu
    { pincode: '600001', city: 'Chennai', state: 'Tamil Nadu' },
    { pincode: '641001', city: 'Coimbatore', state: 'Tamil Nadu' },
    { pincode: '625001', city: 'Madurai', state: 'Tamil Nadu' },
    { pincode: '620001', city: 'Tiruchirappalli', state: 'Tamil Nadu' },
    { pincode: '627001', city: 'Tirunelveli', state: 'Tamil Nadu' },
    { pincode: '636001', city: 'Salem', state: 'Tamil Nadu' },
    { pincode: '632001', city: 'Vellore', state: 'Tamil Nadu' },
    { pincode: '605001', city: 'Puducherry', state: 'Tamil Nadu' },
    { pincode: '643001', city: 'Ooty', state: 'Tamil Nadu' },
    { pincode: '611001', city: 'Nagapattinam', state: 'Tamil Nadu' },
    { pincode: '613001', city: 'Thanjavur', state: 'Tamil Nadu' },
    { pincode: '626101', city: 'Rajapalayam', state: 'Tamil Nadu' },
    // Telangana
    { pincode: '500001', city: 'Hyderabad', state: 'Telangana' },
    { pincode: '506001', city: 'Warangal', state: 'Telangana' },
    { pincode: '505001', city: 'Karimnagar', state: 'Telangana' },
    { pincode: '508001', city: 'Nalgonda', state: 'Telangana' },
    { pincode: '504001', city: 'Adilabad', state: 'Telangana' },
    { pincode: '503001', city: 'Nizamabad', state: 'Telangana' },
    { pincode: '507001', city: 'Khammam', state: 'Telangana' },
    // Tripura
    { pincode: '799001', city: 'Agartala', state: 'Tripura' },
    // Uttar Pradesh
    { pincode: '226001', city: 'Lucknow', state: 'Uttar Pradesh' },
    { pincode: '201301', city: 'Noida', state: 'Uttar Pradesh' },
    { pincode: '201001', city: 'Ghaziabad', state: 'Uttar Pradesh' },
    { pincode: '221001', city: 'Varanasi', state: 'Uttar Pradesh' },
    { pincode: '208001', city: 'Kanpur', state: 'Uttar Pradesh' },
    { pincode: '211001', city: 'Prayagraj', state: 'Uttar Pradesh' },
    { pincode: '282001', city: 'Agra', state: 'Uttar Pradesh' },
    { pincode: '250001', city: 'Meerut', state: 'Uttar Pradesh' },
    { pincode: '243001', city: 'Bareilly', state: 'Uttar Pradesh' },
    { pincode: '244001', city: 'Moradabad', state: 'Uttar Pradesh' },
    { pincode: '245001', city: 'Hapur', state: 'Uttar Pradesh' },
    { pincode: '247001', city: 'Saharanpur', state: 'Uttar Pradesh' },
    { pincode: '251001', city: 'Muzaffarnagar', state: 'Uttar Pradesh' },
    { pincode: '261001', city: 'Sitapur', state: 'Uttar Pradesh' },
    { pincode: '271001', city: 'Gonda', state: 'Uttar Pradesh' },
    { pincode: '272001', city: 'Basti', state: 'Uttar Pradesh' },
    { pincode: '273001', city: 'Gorakhpur', state: 'Uttar Pradesh' },
    { pincode: '274001', city: 'Deoria', state: 'Uttar Pradesh' },
    { pincode: '275101', city: 'Mau', state: 'Uttar Pradesh' },
    { pincode: '276001', city: 'Azamgarh', state: 'Uttar Pradesh' },
    { pincode: '281001', city: 'Mathura', state: 'Uttar Pradesh' },
    { pincode: '283001', city: 'Firozabad', state: 'Uttar Pradesh' },
    { pincode: '284001', city: 'Jhansi', state: 'Uttar Pradesh' },
    { pincode: '285001', city: 'Orai', state: 'Uttar Pradesh' },
    // Uttarakhand
    { pincode: '248001', city: 'Dehradun', state: 'Uttarakhand' },
    { pincode: '263001', city: 'Haldwani', state: 'Uttarakhand' },
    { pincode: '246174', city: 'Haridwar', state: 'Uttarakhand' },
    { pincode: '249201', city: 'Rishikesh', state: 'Uttarakhand' },
    { pincode: '262001', city: 'Rudrapur', state: 'Uttarakhand' },
    { pincode: '263601', city: 'Almora', state: 'Uttarakhand' },
    { pincode: '246149', city: 'Roorkee', state: 'Uttarakhand' },
    { pincode: '246001', city: 'Pauri', state: 'Uttarakhand' },
    // West Bengal
    { pincode: '700001', city: 'Kolkata', state: 'West Bengal' },
    { pincode: '711101', city: 'Howrah', state: 'West Bengal' },
    { pincode: '713101', city: 'Bardhaman', state: 'West Bengal' },
    { pincode: '721101', city: 'Kharagpur', state: 'West Bengal' },
    { pincode: '734001', city: 'Siliguri', state: 'West Bengal' },
    { pincode: '733101', city: 'Malda', state: 'West Bengal' },
    { pincode: '741101', city: 'Krishnanagar', state: 'West Bengal' },
    { pincode: '742101', city: 'Murshidabad', state: 'West Bengal' },
    { pincode: '743101', city: 'Barrackpore', state: 'West Bengal' },
    { pincode: '744101', city: 'Port Blair', state: 'Andaman and Nicobar Islands' },
    // Union Territories
    { pincode: '194101', city: 'Leh', state: 'Ladakh' },
    { pincode: '194103', city: 'Kargil', state: 'Ladakh' },
    { pincode: '682011', city: 'Kavaratti', state: 'Lakshadweep' },
    { pincode: '396210', city: 'Silvassa', state: 'Dadra and Nagar Haveli and Daman and Diu' },
    { pincode: '396215', city: 'Daman', state: 'Dadra and Nagar Haveli and Daman and Diu' },
  ];
  for (const p of pincodes) {
    await prisma.pincode.upsert({
      where: { pincode: p.pincode },
      update: {},
      create: p,
    });
  }

  console.log('Seed completed successfully');
  console.log('Admin login: admin / admin123');
  console.log('Seller login: seller1 / seller123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
