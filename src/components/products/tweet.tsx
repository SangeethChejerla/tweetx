import { Tweetx } from '@/db';

const Tweet = ({ tweet }: { tweet: Tweetx }) => {
  return (
    <div className="group relative">
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">{tweet.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{tweet.option}</p>
        </div>

        <p className="text-sm font-medium text-gray-900">{tweet.bangerlevel}</p>
      </div>
    </div>
  );
};
