// import React from 'react';
// import { FlatList, Pressable, View } from 'react-native';

// import EventCard from './EventCard';
// import BannerCard from './BannerCard';

// import { EventOnEvent } from '../types/event';
// import { Banner } from "../types/banner";

// interface EventListProps {
//   events: EventOnEvent[];
//   onPressEvent: (event: EventOnEvent) => void;
//   disableScroll?: boolean;
//   bannerList: Banner[];
// }

// const EventList: React.FC<EventListProps> = ({ events, onPressEvent, disableScroll, bannerList }) => {
//   if (disableScroll) {
//     return (
//       <View style={{ paddingBottom: 16 }}>
//         {events.map((item) => (
//           <Pressable key={item.id} onPress={() => onPressEvent(item)}>
//             <EventCard
//               start={item.start}
//               name={item.name}
//               location={item.location_name ?? ''}
//             />
//           </Pressable>
//         ))}
//       </View>
//     );
//   }
//   return (
//     <FlatList
//       data={events}
//       keyExtractor={item => item.id.toString()}
//       renderItem={({ item }) => (
//         <Pressable onPress={() => onPressEvent(item)}>
//           <EventCard
//             start={item.start}
//             name={item.name}
//             location={item.location_name ?? ''}
//           />
//         </Pressable>
//       )}
//       contentContainerStyle={{ paddingBottom: 16 }}
//     />
//   );
// };

// export default EventList;

import React, { useMemo } from 'react';
import { FlatList, Pressable, View } from 'react-native';

import EventCard from './EventCard';
import BannerCard from './BannerCard';

import { EventOnEvent } from '../types/event';
import { Banner } from "../types/banner";

interface EventListProps {
  events: EventOnEvent[];
  onPressEvent: (event: EventOnEvent) => void;
  disableScroll?: boolean;
  bannerList: Banner[];
}

type ListItem =
  | { type: 'event'; data: EventOnEvent }
  | { type: 'banner'; data: Banner };

const EventList: React.FC<EventListProps> = ({ events, onPressEvent, disableScroll, bannerList }) => {
  const combinedData: ListItem[] = useMemo(() => {
    const result: ListItem[] = [];
    let bannerIndex = 0;

    events.forEach((event, idx) => {
      result.push({ type: 'event', data: event });

      if ((idx + 1) % 5 === 0 && bannerList.length > 0) {
        result.push({
          type: 'banner',
          data: bannerList[bannerIndex % bannerList.length],
        });
        bannerIndex++;
      }
    });

    return result;
  }, [events, bannerList]);

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === 'event') {
      return (
        <Pressable onPress={() => onPressEvent(item.data)}>
          <EventCard
            start={item.data.start}
            name={item.data.name}
            location={item.data.location_name ?? ''}
          />
        </Pressable>
      );
    }

    if (item.type === 'banner') {
      return <BannerCard banner={item.data} />;
    }

    return null;
  };

  if (disableScroll) {
    return (
      <View style={{ paddingBottom: 16 }}>
        {combinedData.map((item, index) => (
          <View key={index.toString()}>{renderItem({ item })}</View>
        ))}
      </View>
    );
  }

  return (
    <FlatList
      data={combinedData}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 16 }}
    />
  );
};

export default EventList;
