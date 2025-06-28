import { Devvit, Post } from '@devvit/public-api';
import { navigateTo } from '@devvit/client';

// Side effect import to bundle the server. The /index is required for server splitting.
import '../server/index';
import { defineConfig } from '@devvit/server';

defineConfig({
  name: '[Bolt] Community Snoo Pet',
  entry: 'index.html',
  height: 'tall',
  menu: { enable: false },
  // Enable required features for multiplayer
  permissions: {
    reddit: true,
    redis: true,
  }
});

export const BoltBadgeOverlay: Devvit.BlockComponent = () => (
  <hstack 
    alignment="end top" 
    padding="small" 
    width={'100%'} 
    height={'15%'}
    position="absolute"
    top="0px"
    right="0px"
  >
    <image
      url="bolt-badge.png"
      resizeMode="fit"
      description="Built with Bolt.new badge"
      imageHeight={50}
      imageWidth={50}
      onPress={() => navigateTo('https://bolt.new')}
    />
  </hstack>
);

export const BoltGame: Devvit.BlockComponent = () => (
  <zstack width={'100%'} height={'100%'}>
    <webview url="index.html" />
    <BoltBadgeOverlay />
  </zstack>
);

export const Preview: Devvit.BlockComponent<{ text?: string }> = ({ text = 'Community Snoo Pet - Keep it alive together!' }) => {
  return (
    <zstack width={'100%'} height={'100%'} alignment="center middle">
      <vstack width={'100%'} height={'100%'} alignment="center middle" backgroundColor="#f4e4bc">
        {/* Pixel art Snoo preview */}
        <vstack alignment="center middle" backgroundColor="#8b4513" cornerRadius="small" padding="medium">
          <text size="large" weight="bold" color="#f4e4bc">
            COMMUNITY SNOO PET
          </text>
          <spacer size="small" />
          <text size="medium" color="#f4e4bc">
            A shared virtual pet experience
          </text>
          <spacer size="small" />
          <text size="small" color="#e6d4a8">
            Work together to keep Snoo alive!
          </text>
        </vstack>
        <spacer size="medium" />
        <text maxWidth={`80%`} size="medium" weight="bold" alignment="center middle" wrap color="#8b4513">
          {text}
        </text>
        <spacer size="small" />
        <text size="small" color="#654321" alignment="center middle">
          Tap to start caring for your community pet!
        </text>
      </vstack>
    </zstack>
  );
};

// Create the post with custom preview - this ensures the preview stays persistent
Devvit.addMenuItem({
  label: '[Bolt Community Snoo Pet]: New Post',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;

    let post: Post | undefined;
    try {
      const subreddit = await reddit.getCurrentSubreddit();
      post = await reddit.submitPost({
        title: 'Community Snoo Pet - Keep it alive together!',
        subredditName: subreddit.name,
        // Use the custom preview component directly
        preview: <Preview />,
      });
      
      ui.showToast({ text: 'Created community pet post!' });
      ui.navigateTo(post.url);
    } catch (error) {
      if (post) {
        await post.remove(false);
      }
      if (error instanceof Error) {
        ui.showToast({ text: `Error creating post: ${error.message}` });
      } else {
        ui.showToast({ text: 'Error creating post!' });
      }
    }
  },
});

// Configure the main app to use the custom preview
Devvit.configure({
  redditAPI: true,
  redis: true,
});

// Set the main component to use the game with persistent preview
Devvit.addCustomPostType({
  name: 'Community Snoo Pet',
  height: 'tall',
  render: BoltGame,
});

export default Devvit;